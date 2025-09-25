import { AUTH_COOKIE_NAME } from '@/helpers/cookies';
import { AppError } from '@repo/shared/errors';
import { RequestHandler } from 'express';
import { verifyJwt } from '@/helpers/jwt';

export const authenticate: RequestHandler = (req, res, next) => {
  // Try cookie first
  let token = req.cookies[AUTH_COOKIE_NAME];

  // If no cookie, try Authorization header for testing
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    throw AppError.unauthorized('Unauthorized');
  }

  const decoded = verifyJwt(token);
  if (!decoded) {
    throw AppError.unauthorized('Unauthorized');
  }

  (req as any).userId = decoded.sub;

  next();
};
