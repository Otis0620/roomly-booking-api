import { Router } from 'express';

import { DEPENDENCY_IDENTIFIERS, container } from '@config';
import { requireJwt } from '@middleware';

import { HotelController } from '@controllers/v1';
const router = Router();
const hotelsController = container.get<HotelController>(DEPENDENCY_IDENTIFIERS.HotelController);

router.post('/', requireJwt, hotelsController.createHotel.bind(hotelsController));

export default router;
