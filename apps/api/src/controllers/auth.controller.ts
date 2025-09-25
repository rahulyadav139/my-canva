import { LoginUserBody, RegisterUserBody } from '@repo/shared/api';
import type { Request, Response, RequestHandler } from 'express';
import { userService } from '@repo/database/services';
import { AUTH_COOKIE_NAME, setAuthCookie } from '@/helpers/cookies';
import { AppError } from '@repo/shared/errors';
import { createPassword, verifyPassword } from '@/helpers/password';
import { asyncHandler } from '@/utils/async-handler';

export class AuthController {
  static register: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, password, name } = req.body as RegisterUserBody;

      const existingUser = await userService.getUserByEmail(email);

      if (existingUser) {
        throw AppError.unauthorized('User already exists');
      }

      const { salt, passwordHash } = createPassword(password);

      const user = await userService.createUser({
        email,
        password: passwordHash,
        salt,
        name,
      });

      setAuthCookie(res, user.id);

      return res.send({
        success: true,
        message: 'Register success',
        user_id: user.id,
      });
    }
  );

  static login: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const { email, password } = req.body as LoginUserBody;

      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw AppError.unauthorized('Invalid credentials');
      }

      const isPasswordValid = verifyPassword(
        password,
        user.salt,
        user.password
      );

      if (!isPasswordValid) {
        throw AppError.unauthorized('Invalid credentials');
      }

      setAuthCookie(res, user.id);

      return res.send({
        success: true,
        message: 'Login success',
        user_id: user.id,
      });
    }
  );

  static logout: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      res.clearCookie(AUTH_COOKIE_NAME);

      return res.send({ success: true, message: 'Logout success' });
    }
  );
}
