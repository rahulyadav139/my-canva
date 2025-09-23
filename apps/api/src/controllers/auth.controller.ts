import type { Request, Response } from 'express';

export class AuthController {
  static register(req: Request, res: Response) {
    return res.send({ message: 'Register' });
  }

  static login(req: Request, res: Response) {
    return res.send({ message: 'Login' });
  }

  static logout(req: Request, res: Response) {
    return res.send({ message: 'Logout' });
  }
}
