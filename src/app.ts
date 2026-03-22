import express, { Application } from 'express';
import helmet from 'helmet';
import { Container } from 'inversify';

import { errorHandler } from '@middleware/errorHandler';
import { requestId } from '@middleware/requestId';
import { createRoutes } from '@routes/routerFactory';

/**
 * Creates a configured Express application.
 *
 * This is the composition root for the HTTP layer.
 * All dependencies flow down from the container.
 */
export function createApp(container: Container): Application {
  const app = express();

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use(requestId);
  app.use(helmet());
  app.use(express.json());
  app.use('/api', createRoutes(container));
  app.use(errorHandler);

  return app;
}
