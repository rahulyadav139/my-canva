import express, { Express } from 'express';
import { json, urlencoded } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from '@/middlewares/error';
import { notFoundMiddleware } from './middlewares/not-found';
import routes from './routes';
import dotenv from 'dotenv';
dotenv.config();

import { Env } from '@/lib/env';

const clientUrl = Env.get('CLIENT_URL');

export const createApp = (): Express => {
  const app = express();

  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    cors({
      origin: [clientUrl],
      credentials: true,
    })
  );

  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/v1', routes);

  app.use(notFoundMiddleware);

  app.use(errorMiddleware);

  return app;
};
