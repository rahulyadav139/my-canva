import authRouteConfig from './auth.route';
import { Router } from 'express';
import { RouteConfig } from './type';

const routeConfigs: readonly RouteConfig[] = [authRouteConfig] as const;

const router: Router = Router();

// Register all routes
for (const config of routeConfigs) {
  router.use(config.path, config.router);
}

export default router;
