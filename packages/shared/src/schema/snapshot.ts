import { z } from 'zod';
import { Types } from 'mongoose';

export const snapshotSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  canvasId: z.instanceof(Types.ObjectId),
  data: z.instanceof(Uint8Array),
  createdAt: z.date(),
  createdBy: z.instanceof(Types.ObjectId),
});

export type Snapshot = z.infer<typeof snapshotSchema>;