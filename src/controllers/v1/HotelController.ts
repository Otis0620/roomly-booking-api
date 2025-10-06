import { Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';

import { HotelService } from '@services';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';
import { RequestWithUser } from '@infra/http/types';

@injectable()
export class HotelController {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.HotelService) private readonly hotelService: HotelService,
  ) {}

  async createHotel(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json({ hotel: 'name' });
    } catch (error) {
      next(error);
    }
  }
}
