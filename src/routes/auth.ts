import { Router } from 'express';
import { Container } from 'inversify';

import { AuthController } from '@controllers/AuthController';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { validate } from '@middleware/validate';
import { registerSchema, loginSchema } from '@validators/authValidators';

/**
 * Creates authentication routes.
 *
 * Available endpoints:
 * - POST /register - Register a new user
 * - POST /login - Authenticate and get token
 *
 * @param container - DI container with registered dependencies
 * @returns Configured Express router
 */
export function createAuthRoutes(container: Container): Router {
  const router = Router();
  const controller = container.get<AuthController>(IDENTIFIERS.AuthController);

  /**
   * POST /register
   * Registers a new user account.
   */
  router.post('/register', validate(registerSchema), (req, res, next) =>
    controller.register(req, res, next),
  );

  /**
   * POST /login
   * Authenticates a user.
   */
  router.post('/login', validate(loginSchema), (req, res, next) =>
    controller.login(req, res, next),
  );

  return router;
}
