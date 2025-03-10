import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import passport from 'passport';

import { UserDTO } from '@dtos';
import { BaseError, BadRequestError } from '@errors';

@injectable()
export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user } = await new Promise<{ user: UserDTO | null }>((resolve, reject) => {
        passport.authenticate(
          'local-signup',
          { session: false },
          (err: BaseError, user: UserDTO | false) => {
            if (err) return reject(err);

            resolve({ user: user || null });
          },
        )(req, res, next);
      });

      if (!user) {
        throw new BadRequestError();
      }

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
