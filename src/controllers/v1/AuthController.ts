import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import passport from 'passport';

import { UserDTO } from '@dtos';
import { BaseError, BadRequestError } from '@errors';

import { AuthUser } from '@lib/types';

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

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new Promise<AuthUser | null>((resolve, reject) => {
        passport.authenticate(
          'local-login',
          { session: false },
          (err: BaseError, result: AuthUser | false) => {
            if (err) return reject(err);

            resolve(result || null);
          },
        )(req, res, next);
      });

      if (!result?.token) {
        throw new BadRequestError();
      }

      res.status(200).json({
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      next(error);
    }
  }
}
