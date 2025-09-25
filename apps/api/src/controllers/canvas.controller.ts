import { RequestHandler, Request, Response } from 'express';
import { asyncHandler } from '@/utils/async-handler';
import { canvasService, snapshotService } from '@repo/database/services';

export class CanvasController {
  static createCanvas: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req as any).userId;

      const canvas = await canvasService.createCanvas({
        owner: userId,
        collaborators: [],
        permission: 'private',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.send({ success: true, canvas: canvas.id });
    }
  );
}
