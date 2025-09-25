import { Server as HocuspocusServer } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { canvasService, snapshotService } from '@repo/database';
import { Types } from '@repo/database';
import {
  isValidCanvasId,
  createInitialCanvasState,
} from './utils/canvas-utils';
import { verifyJwt } from './helpers/jwt';
import { AppError } from '@repo/shared/errors';

export const createHocuspocusServer = () => {
  const server = new HocuspocusServer({
    port: 1234,

    extensions: [
      new Database({
        // Fetch initial document data from database
        fetch: async ({ documentName }: { documentName: string }) => {
          try {
            // Validate canvas ID format
            if (!isValidCanvasId(documentName)) {
              console.error(`invalid canvas ID format: ${documentName}`);
              return null;
            }

            // Verify canvas exists
            const canvas = await canvasService.getCanvasById(documentName);
            if (!canvas) {
              console.log(`canvas not found: ${documentName}`);
              return null;
            }

            // Get the latest snapshot from database
            const snapshot =
              await snapshotService.getLatestSnapshotByCanvasId(documentName);

            if (snapshot && snapshot.data) {
              try {
                let snapshotData: Uint8Array;

                if (
                  snapshot.data &&
                  typeof snapshot.data.buffer === 'function'
                ) {
                  // @ts-ignore
                  snapshotData = new Uint8Array(snapshot.data.buffer());
                } else if (snapshot.data instanceof Buffer) {
                  snapshotData = new Uint8Array(snapshot.data);
                } else if (snapshot.data instanceof Uint8Array) {
                  snapshotData = snapshot.data;
                } else {
                  snapshotData = new Uint8Array();
                }

                return snapshotData;
              } catch (error) {
                console.error(error);
              }
            }

            return createInitialCanvasState();
          } catch (error) {
            return null;
          }
        },

        // Store document changes to database
        store: async ({
          documentName,
          state,
        }: {
          documentName: string;
          state: Uint8Array;
        }) => {
          try {
            console.log(`💾 Storing document for canvas: ${documentName}`);

            // Validate canvas ID format
            if (!isValidCanvasId(documentName)) {
              console.error(`invalid canvas ID format: ${documentName}`);
              return;
            }

            // Verify canvas exists
            const canvas = await canvasService.getCanvasById(documentName);
            if (!canvas) {
              console.error(`canvas not found: ${documentName}`);
              return;
            }

            await snapshotService.createSnapshot({
              canvasId: new Types.ObjectId(documentName),
              data: Buffer.from(state),
              createdAt: new Date(),
            });

            await canvasService.updateCanvas(documentName, {
              updatedAt: new Date(),
            } as any);
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
      }),
    ],

    //Handle authentication
    onAuthenticate: async ({
      request,
      documentName,
    }: {
      request: any;
      documentName: string;
    }) => {
      try {
        // Extract token from cookies
        const cookieHeader = request?.headers?.cookie || '';
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map((cookie: string) => {
            const [key, ...val] = cookie.trim().split('=');
            return [key, decodeURIComponent(val.join('='))];
          })
        );

        const token = cookies['auth'];

        if (!token) {
          throw AppError.unauthorized('Unauthorized');
        }

        const decoded = verifyJwt(token);

        if (!decoded) {
          throw AppError.unauthorized('Unauthorized');
        }

        const userId = decoded.sub;

        const canvas = await canvasService.getCanvasById(documentName);

        if (!canvas) {
          throw AppError.notFound('Canvas not found');
        }

        if (
          canvas.owner.toString() !== userId.toString() &&
          !canvas.collaborators.includes(userId)
        ) {
          throw AppError.unauthorized('Unauthorized');
        }

        // Return user context
        return { userId };
      } catch (error) {
        console.error(error);
        throw AppError.unauthorized('Authentication failed');
      }
    },

    onConnect: async ({ documentName }: any) => {
      console.log(`client connected to canvas: ${documentName}`);
    },

    onDisconnect: async ({ documentName }: any) => {
      console.log(`client disconnected from canvas: ${documentName}`);
    },

    debounce: 2000,
    maxDebounce: 10000,
  });

  return server;
};

export const startHocuspocusServer = async () => {
  try {
    const server = createHocuspocusServer();

    await server.listen();
    console.log('hocuspocus server started on port 1234');

    return server;
  } catch (error) {
    console.error('failed to start Hocuspocus server:', error);
    throw error;
  }
};
