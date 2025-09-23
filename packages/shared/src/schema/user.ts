import { z } from 'zod';
import { Types } from 'mongoose';

export const userSchema = z.object({
  id: z.instanceof(Types.ObjectId),
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof userSchema>;