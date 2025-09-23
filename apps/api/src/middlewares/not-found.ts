import { AppError, ErrorCode } from '@repo/shared/errors';
import { RequestHandler } from 'express';

export const notFoundMiddleware: RequestHandler = () => {
  throw new AppError('Not Found', ErrorCode.NOT_FOUND);
};
