import { z } from 'zod';

// Client-safe canvas schema without mongoose dependencies
export const canvasClientSchema = z.object({
  id: z.string(), // ObjectId as string for client
  owner: z.string(), // ObjectId as string
  collaborators: z.array(z.string()), // Array of ObjectId strings
  permission: z.enum(['private', 'link', 'public']).default('private'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type CanvasClient = z.infer<typeof canvasClientSchema>;
