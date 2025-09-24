import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { HotelService } from '@services';

@injectable()
export class HotelController {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.HotelService) private readonly hotelService: HotelService,
  ) {}

  async createHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json({ hotel: 'name' });
    } catch (error) {
      next(error);
    }
  }
}
