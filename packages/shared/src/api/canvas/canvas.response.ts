import { Types } from 'mongoose';
import { z } from 'zod';


export const canvasResponseSchema = z.object({
  canvas: z.instanceof(Types.ObjectId),
});

export type CanvasResponse = z.infer<typeof canvasResponseSchema>;