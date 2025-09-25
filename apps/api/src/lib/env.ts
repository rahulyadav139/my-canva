import dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  CLIENT_URL: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string(),
  API_URL: z.string().default('http://localhost:8080'),
  JWT_SECRET: z.string(),
});

type IEnv = z.infer<typeof envSchema>;

export class Env {
  private static env: IEnv;

  private static initialize() {
    const parsed = envSchema.parse(process.env);
    this.env = parsed;
  }

  static get<T extends keyof IEnv>(key: T): IEnv[T] {
    if (!this.env) {
      this.initialize();
    }
    return this.env[key];
  }
}
