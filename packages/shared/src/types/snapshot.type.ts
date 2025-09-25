import { z } from 'zod';

// Client-safe snapshot schema without mongoose dependencies
export const snapshotClientSchema = z.object({
  id: z.string(), // ObjectId as string for client
  canvasId: z.string(), // ObjectId as string
  data: z.string(), // Buffer as base64 string for client
  createdAt: z.date(),
});

export type SnapshotClient = z.infer<typeof snapshotClientSchema>;
