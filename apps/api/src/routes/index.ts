import authRouteConfig from './auth.route';
import userRouteConfig from './user.route';
import { Router } from 'express';
import { RouteConfig } from './type';
import { canvasRouteConfig } from './canvas.route';

const routeConfigs: readonly RouteConfig[] = [
  authRouteConfig,
  userRouteConfig,
  canvasRouteConfig,
] as const;

const router: Router = Router();

// Register all routes
for (const config of routeConfigs) {
  console.log(`Registering route: ${config.path}`);
  router.use(config.path, config.router);
}

export default router;
