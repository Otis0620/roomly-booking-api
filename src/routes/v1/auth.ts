import { Router } from 'express';

import { AuthController } from '@controllers/v1';
import { DEPENDENCY_IDENTIFIERS, getAppContainer } from '@infra/di';

const router = Router();
const container = getAppContainer();

const authController = container.get<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController);

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

export default router;
