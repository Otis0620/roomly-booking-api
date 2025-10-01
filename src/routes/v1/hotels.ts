import { Router } from 'express';

import { HotelController } from '@controllers/v1';
import { DEPENDENCY_IDENTIFIERS, getAppContainer } from '@infra/di';
import { requireJwt } from '@infra/http/middleware';

const router = Router();
const container = getAppContainer();

const hotelsController = container.get<HotelController>(DEPENDENCY_IDENTIFIERS.HotelController);

router.post('/', requireJwt, hotelsController.createHotel.bind(hotelsController));

export default router;
