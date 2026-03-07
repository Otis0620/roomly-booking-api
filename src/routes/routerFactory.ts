import { Router } from 'express';
import { Container } from 'inversify';

import { createAuthRoutes } from '@routes/auth';

/**
 * Creates all API routes.
 *
 * This is the main router factory that assembles all route modules.
 * Routes are versioned under /v1 for future compatibility.
 *
 * @param container - DI container with registered dependencies
 * @returns Configured Express router
 */
export function createRoutes(container: Container): Router {
  const router = Router();

  router.use('/v1/auth', createAuthRoutes(container));

  return router;
}
