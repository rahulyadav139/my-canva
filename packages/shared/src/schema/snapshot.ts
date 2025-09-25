import { z } from 'zod';
import { Types } from 'mongoose';

export const snapshotSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  canvasId: z.instanceof(Types.ObjectId),
  data: z.instanceof(Buffer),
  createdAt: z.date(),
});

export type Snapshot = z.infer<typeof snapshotSchema>;