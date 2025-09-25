import { z } from 'zod';


export const canvasClientSchema = z.object({
  id: z.string(), 
  owner: z.string(),
  collaborators: z.array(z.string()),
  permission: z.enum(['private', 'link', 'public']).default('private'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export type CanvasClient = z.infer<typeof canvasClientSchema>;
