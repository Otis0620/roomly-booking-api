// src/middleware/requireJwt.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UnauthorizedError } from '@errors';

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) return next(new UnauthorizedError('Unauthorized'));

    req.user = user;

    next();
  })(req, res, next);
}
