import { Schema, model } from 'mongoose';
import { Canvas as CanvasSchema } from '@repo/shared/schema';

const canvasSchema = new Schema<CanvasSchema>({
  title: String,
  owner: String,
  collaborators: [String],
  permission: {type: String, enum: ['private', 'link', 'public'], default: 'private'},
  latestSnapshot: {type: Schema.Types.ObjectId, ref: 'Snapshot', required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

export const CanvasModel = model<CanvasSchema>('Canvas', canvasSchema);