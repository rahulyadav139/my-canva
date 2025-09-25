import * as Y from 'yjs';
import { Types } from 'mongoose';

export function initializeCanvasDocument(doc: Y.Doc): void {
  // Create the main canvas map
  const canvasMap = doc.getMap('canvas');

  // Initialize elements array for storing canvas elements
  const elements = new Y.Array();
  canvasMap.set('elements', elements);

  // Initialize metadata map for canvas settings
  const metadata = new Y.Map();
  metadata.set('name', 'Untitled Canvas');
  metadata.set('width', 1080);
  metadata.set('height', 1080);
  metadata.set('backgroundColor', '#ffffff');
  metadata.set('createdAt', new Date().toISOString());

  canvasMap.set('metadata', metadata);

  // Initialize viewport settings
  const viewport = new Y.Map();
  viewport.set('zoom', 1);
  viewport.set('x', 0);
  viewport.set('y', 0);

  canvasMap.set('viewport', viewport);
}

export function isValidCanvasId(documentName: string): boolean {
  return Types.ObjectId.isValid(documentName);
}

export function getDocumentInfo(doc: Y.Doc): any {
  const canvasMap = doc.getMap('canvas');
  const metadata = canvasMap.get('metadata') as Y.Map<any>;
  const elements = canvasMap.get('elements') as Y.Array<any>;

  return {
    elementCount: elements ? elements.length : 0,
    metadata: metadata ? metadata.toJSON() : {},
    hasViewport: canvasMap.has('viewport'),
  };
}

export function createInitialCanvasState(): Uint8Array {
  const doc = new Y.Doc();
  initializeCanvasDocument(doc);
  return Y.encodeStateAsUpdate(doc);
}
