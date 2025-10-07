import { Router } from 'express';

import { HotelController } from '@controllers/v1';
import { DEPENDENCY_IDENTIFIERS, getAppContainer } from '@infra/di';
import { requireJwt } from '@infra/http/middleware';
import { requireRole } from '@infra/http/middleware';
import { UserRole } from '@lib/types';

const router = Router();
const container = getAppContainer();

const hotelsController = container.get<HotelController>(DEPENDENCY_IDENTIFIERS.HotelController);

router.post(
  '/',
  requireJwt,
  requireRole(UserRole.OWNER),
  hotelsController.createHotel.bind(hotelsController),
);

export default router;
