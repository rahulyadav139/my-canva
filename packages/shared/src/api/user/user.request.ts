import { z } from 'zod';

export const registerUserBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const loginUserBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;
export type LoginUserBody = z.infer<typeof loginUserBodySchema>;