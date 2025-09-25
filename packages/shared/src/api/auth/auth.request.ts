import { z } from 'zod';

import { passwordRegex } from '../../constants/regex';

export const registerUserBodySchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(8).max(20).regex(passwordRegex),
});

export type RegisterUserBody = z.infer<typeof registerUserBodySchema>;

export const loginUserBodySchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginUserBody = z.infer<typeof loginUserBodySchema>;
