import { Schema, model, Model } from 'mongoose';
import { Canvas as CanvasSchema } from '@repo/shared/schema';

const canvasSchema = new Schema<CanvasSchema>({
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  collaborators: [String],
  permission: {type: String, enum: ['private', 'link', 'public'], default: 'private'},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
});

export const CanvasModel: Model<CanvasSchema> = model<CanvasSchema>('Canvas', canvasSchema);