import { registerUserBodySchema, loginUserBodySchema } from '@repo/shared/api';

import { AuthController } from '@/controllers/auth.controller';
import { zodValidator } from '@/middlewares/zod-validator';

import { Router } from 'express';
import { RouteConfig } from './type';

const router = Router();

// register with credentials
router.post(
  '/register',
  zodValidator({ body: registerUserBodySchema }),
  AuthController.register
);

// login with credentials
router.post(
  '/login',
  zodValidator({ body: loginUserBodySchema }),
  AuthController.login
);

// logout
router.delete('/logout', AuthController.logout);

// Route configuration
const routeConfig: RouteConfig = { path: '/auth', router };

export default routeConfig;
