import { z } from 'zod';
import { Types } from 'mongoose';

export const canvasSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  owner: z.instanceof(Types.ObjectId), // ObjectId as string
  collaborators: z.array(z.instanceof(Types.ObjectId)), // Array of ObjectId strings
  permission: z.enum(['private', 'link', 'public']).default('private'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Canvas = z.infer<typeof canvasSchema>;
