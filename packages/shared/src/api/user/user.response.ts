import { z } from 'zod';

export const userResponseSchema = z.object({
  user: z.object({
    id: z.string(), 
    name: z.string(),
    email: z.string(),
  }),
});

export type UserResponse = z.infer<typeof userResponseSchema>;