'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Transformer } from 'react-konva';
import {
  CanvasElement,
  useCanvasCollaboration,
} from '@/hooks/use-canvas-collaboration';
import { useKonvaCollaboration } from '@/hooks/use-konva-collaboration';
import { useAwareness } from '@/hooks/use-awareness';
import { ActiveUsersList } from './active-users-list';

interface CollaborativeCanvasProps {
  canvasId: string;
  width?: number;
  height?: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
}

export const CollaborativeCanvas = ({
  canvasId,
  width = 1080,
  height = 1080,
  userId = 'anonymous-user',
  userName = 'Anonymous User',
  userEmail,
  userAvatar,
}: CollaborativeCanvasProps) => {
  const stageRef = useRef<any>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [stageScale] = useState(0.8); // Make scale configurable and more reasonable
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectionRectangle, setSelectionRectangle] = useState({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  const isSelecting = useRef(false);
  const transformerRef = useRef<any>(null);
  const elementRefs = useRef(new Map());

  // Use the canvas collaboration hook
  const collaboration = useCanvasCollaboration({
    canvasId,
    onElementsChange: elements => {
      console.log('Canvas elements updated:', elements);
    },
    onMetadataChange: metadata => {
      console.log('Canvas metadata updated:', metadata);
    },
    onConnectionChange: status => {
      console.log('Connection status changed:', status);
    },
    onError: error => {
      console.error('Collaboration error:', error);
    },
  });

  // Use Konva collaboration helpers
  const konvaCollaboration = useKonvaCollaboration(collaboration, stageRef);

  // Use awareness for user presence and cursors
  const awareness = useAwareness({
    connection: collaboration.connection,
    userId,
    userName,
    userEmail,
    userAvatar,
  });

  // Update transformer when selection changes
  useEffect(() => {
    if (selectedIds.length && transformerRef.current) {
      // Get the nodes from the refs Map
      const nodes = selectedIds
        .map(id => elementRefs.current.get(id))
        .filter(node => node);

      transformerRef.current.nodes(nodes);
    } else if (transformerRef.current) {
      // Clear selection
      transformerRef.current.nodes([]);
    }
  }, [selectedIds]);

  // Initialize canvas metadata
  useEffect(() => {
    if (collaboration.isConnected && collaboration.metadata.width !== width) {
      collaboration.updateMetadata({ width, height });
    }
  }, [collaboration, width, height]);

  // Click handler for stage
  const handleStageClick = (e: any) => {
    // If we are selecting with rect, do nothing
    if (selectionRectangle.visible) {
      return;
    }

    // If click on empty area - remove all selections
    if (e.target === e.target.getStage()) {
      setSelectedIds([]);
      awareness.clearSelection();
      return;
    }

    const clickedId = e.target.id();

    // Do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = selectedIds.includes(clickedId);

    if (!metaPressed && !isSelected) {
      // If no key pressed and the node is not selected
      // select just one
      setSelectedIds([clickedId]);
    } else if (metaPressed && isSelected) {
      // If we pressed keys and node was selected
      // we need to remove it from selection
      setSelectedIds(selectedIds.filter(id => id !== clickedId));
    } else if (metaPressed && !isSelected) {
      // Add the node into selection
      setSelectedIds([...selectedIds, clickedId]);
    }
  };

  // Add sample objects for demonstration
  const addRectangle = () => {
    collaboration.addElement({
      type: 'rect',
      x: Math.random() * (width - 100),
      y: Math.random() * (height - 100),
      width: 100,
      height: 100,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      draggable: true,
    });
  };

  const addCircle = () => {
    collaboration.addElement({
      type: 'circle',
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      width: 100,
      height: 100,
      fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
      draggable: true,
    });
  };

  const addText = () => {
    collaboration.addElement({
      type: 'text',
      x: Math.random() * (width - 200),
      y: Math.random() * (height - 50),
      text: 'Hello Collaboration!',
      fontSize: 24,
      fill: '#333',
      draggable: true,
    });
  };

  const clearCanvas = () => {
    collaboration.clearCanvas();
  };

  // Handle mouse movement for cursor tracking
  const handleMouseMove = (e: any) => {
    // Do nothing if we didn't start selection
    if (!isSelecting.current) {
      return;
    }

    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();

    if (pointer && canvasContainerRef.current) {
      setSelectionRectangle({
        ...selectionRectangle,
        x2: pointer.x,
        y2: pointer.y,
      });

      const containerRect = canvasContainerRef.current.getBoundingClientRect();
      const stageWrapper =
        canvasContainerRef.current.querySelector('.relative');
      const stageWrapperRect = stageWrapper?.getBoundingClientRect();

      if (stageWrapperRect) {
        // Calculate cursor position relative to the stage wrapper
        const relativeX =
          pointer.x * stageScale + stageWrapperRect.left - containerRect.left;
        const relativeY =
          pointer.y * stageScale + stageWrapperRect.top - containerRect.top;

        awareness.setCursor(relativeX, relativeY, true);
      }
    }
  };

  // Handle mouse leave to hide cursor
  const handleMouseLeave = () => {
    awareness.clearCursor();
  };

  // Function to constrain element position within stage bounds
  const constrainToStage = (
    element: CanvasElement,
    newX: number,
    newY: number
  ) => {
    let elementWidth = element.width || 100;
    let elementHeight = element.height || 100;

    // Handle circles differently - they use radius and center position
    if (element.type === 'circle') {
      const radius = elementWidth / 2;
      elementWidth = radius;
      elementHeight = radius;
    }

    // Use the actual stage dimensions
    const effectiveStageWidth = width;
    const effectiveStageHeight = height;

    // Constrain X position
    const minX = element.type === 'circle' ? elementWidth : 0;
    const maxX = effectiveStageWidth - elementWidth;
    //   (element.type === 'circle' ? elementWidth : elementWidth);
    const constrainedX = Math.max(minX, Math.min(maxX, newX));

    // Constrain Y position
    const minY = element.type === 'circle' ? elementHeight : 0;
    const maxY = effectiveStageHeight - elementHeight;
    //   (element.type === 'circle' ? elementHeight : elementHeight);
    const constrainedY = Math.max(minY, Math.min(maxY, newY));

    return { x: constrainedX, y: constrainedY };
  };

  // Render Konva shapes based on canvas objects
  const renderShape = (element: CanvasElement) => {
    const commonProps = {
      id: element.id,
      x: element.x,
      y: element.y,
      fill: element.fill,
      stroke: element.stroke,
      strokeWidth: element.strokeWidth,
      rotation: element.rotation || 0,
      scaleX: element.scaleX || 1,
      scaleY: element.scaleY || 1,
      opacity: element.opacity || 1,
      visible: element.visible !== false,
      draggable: element.draggable !== false,
      onDragEnd: (e: any) => {
        const node = e.target;
        const constrainedPos = constrainToStage(element, node.x(), node.y());

        // Update node position if it was constrained
        if (constrainedPos.x !== node.x() || constrainedPos.y !== node.y()) {
          node.position(constrainedPos);
        }

        konvaCollaboration.handleObjectDragEnd(e);
        awareness.setSelection([element.id], 'transforming');
      },
      onTransformEnd: (e: any) => {
        konvaCollaboration.handleObjectTransformEnd(e);
        awareness.setSelection([element.id], 'selecting');
      },
      onClick: () => {
        setSelectedId(element.id);
        awareness.setSelection([element.id], 'selecting');
      },
      onDragStart: () => {
        awareness.setSelection([element.id], 'transforming');
      },
      dragBoundFunc: (pos: any) => {
        const constrainedPos = constrainToStage(element, pos.x, pos.y);
        return constrainedPos;
      },
      ref: (node: any) => {
        if (node) {
          elementRefs.current.set(element.id, node);
        }
      },
    };

    switch (element.type) {
      case 'rect':
        return (
          <Rect
            {...commonProps}
            key={element.id}
            width={element.width || 100}
            height={element.height || 100}
          />
        );
      case 'circle':
        return (
          <Circle
            {...commonProps}
            key={element.id}
            radius={(element.width || 100) / 2}
          />
        );
      case 'text':
        return (
          <Text
            {...commonProps}
            key={element.id}
            text={element.text || 'Text'}
            fontSize={element.fontSize || 16}
            fontFamily={element.fontFamily || 'Arial'}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-gray-100 p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">Canvas: {canvasId}</h3>
          <ActiveUsersList activeUsers={awareness.getActiveUsers()} />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={addRectangle}
            disabled={!collaboration.isConnected}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Add Rectangle
          </button>
          <button
            onClick={addCircle}
            disabled={!collaboration.isConnected}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Add Circle
          </button>
          <button
            onClick={addText}
            disabled={!collaboration.isConnected}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Add Text
          </button>
          <button
            onClick={clearCanvas}
            disabled={!collaboration.isConnected}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Clear Canvas
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 border-b">
        <div className="flex items-center justify-between">
          <div>
            Objects: {collaboration.elements.length} | Connected:{' '}
            {collaboration.isConnected ? 'Yes' : 'No'} | Synced:{' '}
            {collaboration.isSynced ? 'Yes' : 'No'}
          </div>
          <div>
            Canvas: {collaboration.metadata.width} x{' '}
            {collaboration.metadata.height} | Last Modified:{' '}
            {new Date(collaboration.metadata.lastModified).toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="flex-1 overflow-auto p-4 relative flex items-center justify-center"
        ref={canvasContainerRef}
      >
        <div className="relative mt-120">
          <Stage
            ref={stageRef}
            width={width}
            height={height}
            onClick={handleStageClick}
            onTap={handleStageClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              backgroundColor: collaboration.metadata.backgroundColor,
              boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            <Layer>
              {collaboration.elements.map(renderShape)}

              <Transformer
                ref={transformerRef}
                borderStroke="#000"
                borderStrokeWidth={3}
                anchorFill="#fff"
                anchorStroke="#000"
                anchorStrokeWidth={2}
                anchorSize={20}
                anchorCornerRadius={50}
              />

              {/* Selection rectangle */}
              {selectionRectangle.visible && (
                <Rect
                  x={Math.min(selectionRectangle.x1, selectionRectangle.x2)}
                  y={Math.min(selectionRectangle.y1, selectionRectangle.y2)}
                  width={Math.abs(
                    selectionRectangle.x2 - selectionRectangle.x1
                  )}
                  height={Math.abs(
                    selectionRectangle.y2 - selectionRectangle.y1
                  )}
                  fill="rgba(0,0,255,0.5)"
                />
              )}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};
