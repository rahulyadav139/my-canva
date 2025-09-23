import { Router } from 'express';

export interface RouteConfig {
  path: string;
  router: Router;
}