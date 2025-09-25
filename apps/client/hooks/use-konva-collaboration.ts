import { useCallback } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';

import {
  CanvasElement,
  UseCanvasCollaborationReturn,
} from './use-canvas-collaboration';

interface UseKonvaCollaborationReturn {
  handleObjectDragEnd: (e: KonvaEventObject<globalThis.DragEvent>) => void;
  handleObjectTransformEnd: (e: KonvaEventObject<Event>) => void;
  handleStageTransform: () => void;
}

// Helper hook for handling Konva events with collaboration
export const useKonvaCollaboration = (
  collaboration: UseCanvasCollaborationReturn,
  stageRef: React.RefObject<any>
): UseKonvaCollaborationReturn => {
  // Handle object drag end
  const handleObjectDragEnd = useCallback(
    (e: KonvaEventObject<globalThis.DragEvent>) => {
      const id = e.target.id();
      const { x, y } = e.target.position();

      collaboration.updateElement(id, { x, y });
    },
    [collaboration]
  );

  // Handle object transform end (resize, rotate)
  const handleObjectTransformEnd = useCallback(
    (e: KonvaEventObject<Event>) => {
      const id = e.target.id();
      const node = e.target;

      const updates: Partial<CanvasElement> = {
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      };

      // For shapes with width/height, update actual dimensions
      if (node.width && node.height) {
        updates.width = node.width() * node.scaleX();
        updates.height = node.height() * node.scaleY();
        updates.scaleX = 1;
        updates.scaleY = 1;
      }

      collaboration.updateElement(id, updates);
    },
    [collaboration]
  );

  // Handle stage pan/zoom
  const handleStageTransform = useCallback(() => {
    if (!stageRef.current) return;

    const stage = stageRef.current;
    collaboration.updateMetadata({
      zoom: stage.scaleX(),
      panX: stage.x(),
      panY: stage.y(),
    });
  }, [collaboration, stageRef]);

  return {
    handleObjectDragEnd,
    handleObjectTransformEnd,
    handleStageTransform,
  };
};
