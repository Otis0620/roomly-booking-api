import { Router } from 'express';

import { DEPENDENCY_IDENTIFIERS, container } from '@config';

import { AuthController } from '@controllers/v1';

const router = Router();
const authController = container.get<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController);

router.post('/register', authController.register.bind(authController));

export default router;
