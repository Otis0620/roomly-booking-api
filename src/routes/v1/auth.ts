import { Router } from 'express';

import { AuthController } from '@controllers/v1';
import { DEPENDENCY_IDENTIFIERS, getAppContainer } from '@infra/di';

const router = Router();
const container = getAppContainer();

const authController = container.get<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController);

/**
 * Register a new user.
 * Expects a JSON payload containing user credentials.
 */
router.post('/register', authController.register.bind(authController));

/**
 * Authenticate a user and return an access token.
 * Expects a JSON payload containing login credentials.
 */
router.post('/login', authController.login.bind(authController));

export default router;
