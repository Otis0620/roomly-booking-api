import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UserDTO } from '@dtos';
import { BaseError, BadRequestError } from '@errors';

import { Controller, Post } from '@infra/http/adapters';
import { UserLoginResponse } from '@lib/types';

@Controller('/v1/auth')
export class AuthController {
  @Post('/register')
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

  @Post('/login')
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await new Promise<{ user: UserDTO; token: string } | null>(
        (resolve, reject) => {
          passport.authenticate(
            'local-login',
            { session: false },
            (err: BaseError, result: UserLoginResponse | false) => {
              if (err) return reject(err);

              resolve(result || null);
            },
          )(req, res, next);
        },
      );

      if (!result) {
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
