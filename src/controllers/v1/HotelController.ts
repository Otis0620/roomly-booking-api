import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';

import { HotelService } from '@services';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';
import { Controller, Post } from '@infra/http/adapters';
import { requireJwt } from '@infra/http/middleware';

@Controller('/v1/hotels', requireJwt)
export class HotelController {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.HotelService) private readonly hotelService: HotelService,
  ) {}

  @Post('/')
  async createHotel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(201).json({ hotel: 'name' });
    } catch (error) {
      next(error);
    }
  }
}
