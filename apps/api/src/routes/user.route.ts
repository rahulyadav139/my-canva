import { Router } from 'express';
import { RouteConfig } from './type';
import { UserController } from '@/controllers/user.controller';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.get('/me', authenticate, UserController.getMe);

// Route configuration
const routeConfig: RouteConfig = { path: '/users', router };

export default routeConfig;
