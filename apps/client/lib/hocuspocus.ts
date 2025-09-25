import { HocuspocusProvider } from '@hocuspocus/provider';
import { Awareness } from 'y-protocols/awareness';
import * as Y from 'yjs';

const HOCUSPOCUS_CONFIG = {
  url: process.env.NEXT_PUBLIC_HOCUSPOCUS_URL!,
  maxBackoffTime: 30000,
  retryDelay: 1000,
} as const;

export interface HocuspocusConnectionOptions {
  documentName: string;
  token?: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onSynced?: () => void;
}

export interface CanvasCollaborationData {
  elements: Y.Array<unknown>;
  metadata: Y.Map<unknown>;
}

// User awareness data structure
export interface UserAwarenessState {
  user: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
    color: string; // Unique color for this user
  };
  cursor?: {
    x: number;
    y: number;
    visible: boolean;
  };
  selection?: {
    elementIds: string[];
    action?: 'selecting' | 'editing' | 'transforming';
  };
  lastSeen: number;
}

export const createHocuspocusConnection = ({
  documentName,
  token,
  onConnect,
  onDisconnect,
  onSynced,
}: HocuspocusConnectionOptions) => {
  // Create a new Yjs document
  const ydoc = new Y.Doc();

  // Create awareness instance
  const awareness = new Awareness(ydoc);

  // Define the collaborative data structures for canvas
  const canvasData: CanvasCollaborationData = {
    elements: ydoc.getArray('elements'),
    metadata: ydoc.getMap('metadata'),
  };

  // Create the Hocuspocus provider
  const provider = new HocuspocusProvider({
    url: HOCUSPOCUS_CONFIG.url,
    name: documentName,
    document: ydoc,
    awareness: awareness,
    token: token,

    // Connection event handlers
    onConnect: () => {
      console.log(`connected to canvas: ${documentName}`);
      onConnect?.();
    },

    onDisconnect: () => {
      console.log(`disconnected from canvas: ${documentName}`);
      onDisconnect?.();
    },

    onSynced: () => {
      console.log(`canvas synced: ${documentName}`);
      onSynced?.();
    },

    onAuthenticationFailed: ({ reason }: { reason: string }) => {
      console.error(`authentication failed for ${documentName}:`, reason);
    },
  });

  // Generate a unique color for this user
  const generateUserColor = (): string => {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#96CEB4',
      '#FFEAA7',
      '#DDA0DD',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E9',
      '#F8C471',
      '#82E0AA',
      '#F1948A',
      '#85C1E9',
      '#D7BDE2',
    ];
    return colors[Math.floor(Math.random() * colors.length)] || '#FF6B6B';
  };

  return {
    provider,
    ydoc,
    awareness,
    canvasData,

    // Awareness methods
    setUserAwareness: (state: Partial<UserAwarenessState>) => {
      const currentState =
        (awareness.getLocalState() as UserAwarenessState) || {};
      awareness.setLocalState({
        ...currentState,
        ...state,
        lastSeen: Date.now(),
      });
    },

    getUserAwareness: () =>
      awareness.getLocalState() as UserAwarenessState | null,

    getAllUserAwareness: () => {
      const states = new Map<number, UserAwarenessState>();
      awareness.getStates().forEach((state, clientId) => {
        if (state && clientId !== awareness.clientID) {
          states.set(clientId, state as UserAwarenessState);
        }
      });
      return states;
    },

    // Utility methods
    destroy: () => {
      awareness.destroy();
      provider.destroy();
    },

    isConnected: () => provider.synced || false,

    isSynced: () => provider.synced,

    getConnectionStatus: () => ({
      connected: provider.synced || false,
      synced: provider.synced || false,
      connecting: false, // Provider doesn't expose this directly
    }),

    // Helper to generate user color
    generateUserColor,
  };
};

export const isValidCanvasId = (canvasId: string): boolean => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(canvasId);
};

class HocuspocusConnectionManager {
  private connections = new Map<
    string,
    ReturnType<typeof createHocuspocusConnection>
  >();

  getConnection(
    documentName: string,
    options?: Omit<HocuspocusConnectionOptions, 'documentName'>
  ) {
    if (!this.connections.has(documentName)) {
      const connection = createHocuspocusConnection({
        documentName,
        ...options,
      });

      this.connections.set(documentName, connection);
    }

    return this.connections.get(documentName)!;
  }

  closeConnection(documentName: string) {
    const connection = this.connections.get(documentName);
    if (connection) {
      connection.destroy();
      this.connections.delete(documentName);
    }
  }

  closeAllConnections() {
    for (const [, connection] of this.connections) {
      connection.destroy();
    }
    this.connections.clear();
  }

  getAllConnections() {
    return Array.from(this.connections.entries()).map(
      ([documentName, connection]) => ({
        documentName,
        ...connection.getConnectionStatus(),
      })
    );
  }
}

export const connectionManager = new HocuspocusConnectionManager();

export type HocuspocusConnection = ReturnType<
  typeof createHocuspocusConnection
>;
