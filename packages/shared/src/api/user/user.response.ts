import { z } from 'zod';
import { Types } from 'mongoose';

export const userResponseSchema = z.object({
    user: z.object({
  id: z.instanceof(Types.ObjectId),
    name: z.string(),
    email: z.string(),
  }),
});

export type UserResponse = z.infer<typeof userResponseSchema>;