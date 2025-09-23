import { Schema, model } from 'mongoose';
import { Snapshot as SnapshotSchema } from '@repo/shared/schema';

const snapshotSchema = new Schema<SnapshotSchema>({
  canvasId: {type: Schema.Types.ObjectId, ref: 'Canvas', required: true},
  data: {type: Buffer, required: true},
  createdAt: {type: Date, default: Date.now},
  createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
});

export const SnapshotModel = model<SnapshotSchema>('Snapshot', snapshotSchema);