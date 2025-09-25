import jwt from 'jsonwebtoken';
import { Env } from '@/lib/env';
import { Types } from '@repo/database';

const JWT_SECRET = Env.get('JWT_SECRET');

export const JWT_EXPIRES_IN = 30 * 24 * 60 * 60; // 30 days

export interface JwtPayload {
  sub: Types.ObjectId;
  email?: string;
}

export function signJwt(
  payload: JwtPayload,
  options?: jwt.SignOptions
): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    ...options,
  });
}

export function verifyJwt<T = JwtPayload>(token: string): T | null {
  try {
    return jwt.verify(token, JWT_SECRET) as T;
  } catch (err) {
    return null;
  }
}

export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    const decoded = jwt.decode(token);
    if (!decoded) return null;
    return decoded as T;
  } catch (err) {
    return null;
  }
}
