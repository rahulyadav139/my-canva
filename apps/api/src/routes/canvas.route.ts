import { Router } from 'express';
import { RouteConfig } from './type';
import { CanvasController } from '@/controllers/canvas.controller';
import { authenticate } from '@/middlewares/auth';

const router = Router();

router.post('/', authenticate, CanvasController.createCanvas);

export const canvasRouteConfig: RouteConfig = {
  path: '/canvas',
  router,
};
