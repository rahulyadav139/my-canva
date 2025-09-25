import { z } from 'zod';

export const canvasResponseSchema = z.object({
  canvas: z.string(), 
});

export type CanvasResponse = z.infer<typeof canvasResponseSchema>;