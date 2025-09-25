import { asyncHandler } from '@/utils/async-handler';
import { userService } from '@repo/database/services';
import { Request, RequestHandler } from 'express';
import { Response } from 'express';

export class UserController {
  static getMe: RequestHandler = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = (req as any).userId;
      const user = await userService.getUserById(userId);
      return res.send({ success: true, user });
    }
  );
}
