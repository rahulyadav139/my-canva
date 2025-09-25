import { Response } from 'express';
import { Types } from '@repo/database';
import { signJwt, JWT_EXPIRES_IN } from './jwt';
import { Env } from '@/lib/env';

const NODE_ENV = Env.get('NODE_ENV');

export const AUTH_COOKIE_NAME = 'auth';

export const setAuthCookie = (res: Response, userId: Types.ObjectId) => {
  const token = signJwt({ sub: userId });

  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    maxAge: JWT_EXPIRES_IN * 1000,
    expires: new Date(Date.now() + JWT_EXPIRES_IN * 1000),
  });
};
