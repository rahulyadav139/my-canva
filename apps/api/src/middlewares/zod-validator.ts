import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const zodValidator = (data: {
  [key in 'body' | 'query' | 'params']?: ZodType;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Object.entries(data).forEach(([key, schema]) => {
      const result = schema.safeParse(req[key as keyof Request]);
      if (!result.success) {
        throw result.error;
      }
    });

    next();
  };
};
