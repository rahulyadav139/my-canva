import { useEffect, useState, useCallback, useRef } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import * as Y from 'yjs';
import {
  connectionManager,
  isValidCanvasId,
  type HocuspocusConnection,
} from '@/lib/hocuspocus';

// Types for canvas objects that will be synchronized
export interface CanvasElement {
  id: string;
  type: 'rect' | 'circle' | 'line' | 'text' | 'image';
  x: number;
  y: number;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  src?: string; // for images
  points?: number[]; // for lines
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  opacity?: number;
  visible?: boolean;
  draggable?: boolean;
  // Add other Konva properties as needed
}

export interface CanvasMetadata {
  width: number;
  height: number;
  backgroundColor: string;
  zoom: number;
  panX: number;
  panY: number;
  lastModified: number;
  lastModifiedBy?: string;
}

export interface UseCanvasCollaborationOptions {
  canvasId: string;
  onElementsChange?: (elements: CanvasElement[]) => void;
  onMetadataChange?: (metadata: CanvasMetadata) => void;
  onConnectionChange?: (status: {
    connected: boolean;
    synced: boolean;
  }) => void;
  onError?: (error: Error) => void;
}

export interface UseCanvasCollaborationReturn {
  // Connection status
  isConnected: boolean;
  isSynced: boolean;
  isConnecting: boolean;

  // Canvas data
  elements: CanvasElement[];
  metadata: CanvasMetadata;

  // Methods to update canvas
  addElement: (element: Omit<CanvasElement, 'id'>) => string;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  updateMetadata: (updates: Partial<CanvasMetadata>) => void;

  // Bulk operations
  setElements: (elements: CanvasElement[]) => void;
  clearCanvas: () => void;

  // Utility methods
  getElementById: (id: string) => CanvasElement | undefined;
  disconnect: () => void;
  reconnect: () => void;

  // Expose connection for awareness
  connection: HocuspocusConnection | null;
}

export const useCanvasCollaboration = ({
  canvasId,
  onElementsChange,
  onMetadataChange,
  onConnectionChange,
  onError,
}: UseCanvasCollaborationOptions): UseCanvasCollaborationReturn => {
  const [connection, setConnection] = useState<HocuspocusConnection | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [elements, setElementsState] = useState<CanvasElement[]>([]);
  const [metadata, setMetadata] = useState<CanvasMetadata>({
    width: 1080,
    height: 1080,
    backgroundColor: '#ffffff',
    zoom: 1,
    panX: 0,
    panY: 0,
    lastModified: Date.now(),
  });

  const callbacksRef = useRef({
    onElementsChange,
    onMetadataChange,
    onConnectionChange,
    onError,
  });

  // Update callbacks ref when props change
  useEffect(() => {
    callbacksRef.current = {
      onElementsChange,
      onMetadataChange,
      onConnectionChange,
      onError,
    };
  }, [onElementsChange, onMetadataChange, onConnectionChange, onError]);

  // Initialize connection
  useEffect(() => {
    if (!canvasId || !isValidCanvasId(canvasId)) {
      callbacksRef.current.onError?.(
        new Error(`Invalid canvas ID: ${canvasId}`)
      );
      return;
    }

    try {
      setIsConnecting(true);

      const newConnection = connectionManager.getConnection(canvasId, {
        onConnect: () => {
          setIsConnected(true);
          setIsConnecting(false);
          callbacksRef.current.onConnectionChange?.({
            connected: true,
            synced: false,
          });
        },
        onDisconnect: () => {
          setIsConnected(false);
          setIsSynced(false);
          setIsConnecting(false);
          callbacksRef.current.onConnectionChange?.({
            connected: false,
            synced: false,
          });
        },
        onSynced: () => {
          setIsSynced(true);
          callbacksRef.current.onConnectionChange?.({
            connected: true,
            synced: true,
          });
        },
      });

      setConnection(newConnection);

      // Set up observers for collaborative data changes
      const { canvasData } = newConnection;

      // Observer for objects array changes
      const elementsObserver = () => {
        const elementsArray = canvasData.elements.toArray() as CanvasElement[];
        setElementsState([...elementsArray]);
        callbacksRef.current.onElementsChange?.(elementsArray);
      };

      // Observer for metadata map changes
      const metadataObserver = () => {
        const metadataMap = canvasData.metadata;
        const newMetadata: CanvasMetadata = {
          width: (metadataMap.get('width') as number) || 1080,
          height: (metadataMap.get('height') as number) || 1080,
          backgroundColor:
            (metadataMap.get('backgroundColor') as string) || '#ffffff',
          zoom: (metadataMap.get('zoom') as number) || 1,
          panX: (metadataMap.get('panX') as number) || 0,
          panY: (metadataMap.get('panY') as number) || 0,
          lastModified:
            (metadataMap.get('lastModified') as number) || Date.now(),
          lastModifiedBy: metadataMap.get('lastModifiedBy') as
            | string
            | undefined,
        };
        setMetadata(newMetadata);
        callbacksRef.current.onMetadataChange?.(newMetadata);
      };

      // Add observers
      canvasData.elements.observe(elementsObserver);
      canvasData.metadata.observe(metadataObserver);

      // Initial data load
      elementsObserver();
      metadataObserver();

      // Cleanup function
      return () => {
        canvasData.elements.unobserve(elementsObserver);
        canvasData.metadata.unobserve(metadataObserver);
      };
    } catch (error) {
      setIsConnecting(false);
      callbacksRef.current.onError?.(error as Error);
    }
  }, [canvasId]);

  // Generate unique ID for objects
  const generateElementId = useCallback(() => {
    return `element_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  // Add new object to canvas
  const addElement = useCallback(
    (elementData: Omit<CanvasElement, 'id'>): string => {
      if (!connection) return '';

      const id = generateElementId();
      const newElement: CanvasElement = { ...elementData, id };

      connection.canvasData.elements.push([newElement]);

      // Update metadata
      connection.canvasData.metadata.set('lastModified', Date.now());

      return id;
    },
    [connection, generateElementId]
  );

  // Update existing object
  const updateElement = useCallback(
    (id: string, updates: Partial<CanvasElement>) => {
      if (!connection) return;

      const elementsArray = connection.canvasData.elements;
      const index = (elementsArray.toArray() as CanvasElement[]).findIndex(
        (element: CanvasElement) => element.id === id
      );

      if (index !== -1) {
        const currentElement = elementsArray.get(index) as CanvasElement;
        const updatedElement = { ...currentElement, ...updates };

        // Replace the object at the specific index
        elementsArray.delete(index, 1);
        elementsArray.insert(index, [updatedElement]);

        // Update metadata
        connection.canvasData.metadata.set('lastModified', Date.now());
      }
    },
    [connection]
  );

  // Delete object from canvas
  const deleteElement = useCallback(
    (id: string) => {
      if (!connection) return;

      const elementsArray = connection.canvasData.elements;
      const index = (elementsArray.toArray() as CanvasElement[]).findIndex(
        (element: CanvasElement) => element.id === id
      );

      if (index !== -1) {
        elementsArray.delete(index, 1);

        // Update metadata
        connection.canvasData.metadata.set('lastModified', Date.now());
      }
    },
    [connection]
  );

  // Update canvas metadata
  const updateMetadata = useCallback(
    (updates: Partial<CanvasMetadata>) => {
      if (!connection) return;

      const metadataMap = connection.canvasData.metadata;

      Object.entries(updates).forEach(([key, value]) => {
        metadataMap.set(key, value);
      });

      metadataMap.set('lastModified', Date.now());
    },
    [connection]
  );

  // Set all objects (bulk operation)
  const setElements = useCallback(
    (newElements: CanvasElement[]) => {
      if (!connection) return;

      // Clear existing objects and add new ones
      connection.canvasData.elements.delete(
        0,
        connection.canvasData.elements.length
      );
      connection.canvasData.elements.push(newElements);

      // Update metadata
      connection.canvasData.metadata.set('lastModified', Date.now());
    },
    [connection]
  );

  // Clear entire canvas
  const clearCanvas = useCallback(() => {
    if (!connection) return;

    connection.canvasData.elements.delete(
      0,
      connection.canvasData.elements.length
    );
    connection.canvasData.metadata.set('lastModified', Date.now());
  }, [connection]);

  // Get object by ID
  const getElementById = useCallback(
    (id: string): CanvasElement | undefined => {
      return elements.find(element => element.id === id);
    },
    [elements]
  );

  // Disconnect from collaboration
  const disconnect = useCallback(() => {
    if (connection) {
      connectionManager.closeConnection(canvasId);
      setConnection(null);
      setIsConnected(false);
      setIsSynced(false);
      setIsConnecting(false);
    }
  }, [connection, canvasId]);

  // Reconnect to collaboration
  const reconnect = useCallback(() => {
    if (connection) {
      disconnect();
    }
    // The useEffect will handle reconnection when connection becomes null
  }, [connection, disconnect]);

  return {
    // Connection status
    isConnected,
    isSynced,
    isConnecting,

    // Canvas data
    elements,
    metadata,

    // Methods to update canvas
    addElement,
    updateElement,
    deleteElement,
    updateMetadata,

    // Bulk operations
    setElements,
    clearCanvas,

    // Utility methods
    getElementById,
    disconnect,
    reconnect,

    // Expose connection for awareness
    connection,
  };
};
