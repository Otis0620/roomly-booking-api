import { Router } from 'express';

import { AuthController } from '@controllers/v1';

import { DEPENDENCY_IDENTIFIERS, container } from '@config';

const router = Router();
const authController = container.get<AuthController>(DEPENDENCY_IDENTIFIERS.AuthController);

router.post('/register', authController.register.bind(authController));

export default router;
