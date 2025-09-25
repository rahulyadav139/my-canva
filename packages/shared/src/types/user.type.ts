import { z } from 'zod';

// Client-safe user schema without mongoose dependencies
export const userClientSchema = z.object({
  id: z.string(), // ObjectId as string for client
  name: z.string(),
  email: z.string(),
  password: z.string(),
  salt: z.string(),
});

export type UserClient = z.infer<typeof userClientSchema>;
