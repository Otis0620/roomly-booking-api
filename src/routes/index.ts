import { Router } from 'express';

import authRoutes from './v1/auth';
import hotelsRoutes from './v1/hotels';

const apiRouter = Router();

apiRouter.use('/v1/auth', authRoutes);
apiRouter.use('/v1/hotels', hotelsRoutes);

export default apiRouter;
