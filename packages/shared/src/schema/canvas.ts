import { z } from 'zod';
import { Types } from 'mongoose';

export const canvasSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  title: z.string().default('Untitled'),
  owner: z.string(), // ObjectId as string
  collaborators: z.array(z.string()), // Array of ObjectId strings
  permission: z.enum(['private', 'link', 'public']).default('private'),
  latestSnapshot: z.instanceof(Types.ObjectId),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type Canvas = z.infer<typeof canvasSchema>;
