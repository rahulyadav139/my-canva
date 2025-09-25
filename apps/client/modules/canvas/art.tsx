'use client';

import { HocuspocusProvider } from '@/modules/canvas/contexts/hocuspocus-context';
import { CollaborativeCanvas } from './components/collaborative-canvas';

interface CanvasArtProps {
  canvasId: string;
}

export const CanvasArt = ({ canvasId }: CanvasArtProps) => {
  return (
    <HocuspocusProvider
      autoReconnect={true}
      reconnectDelay={3000}
      maxReconnectAttempts={10}
      onGlobalConnect={() =>
        console.log('🌐 Global Hocuspocus connection established')
      }
      onGlobalDisconnect={() =>
        console.log('🌐 Global Hocuspocus connection lost')
      }
      onError={error => console.error('🌐 Global Hocuspocus error:', error)}
    >
      <div className="w-full h-screen border border-green-300">
        <CollaborativeCanvas canvasId={canvasId} />
      </div>
    </HocuspocusProvider>
  );
};
