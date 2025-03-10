import { Router } from 'express';

import authRoutes from './v1/auth';

const apiRouter = Router();

apiRouter.use('/v1/auth', authRoutes);

export default apiRouter;
