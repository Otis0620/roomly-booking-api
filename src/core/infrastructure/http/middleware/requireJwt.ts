import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UnauthorizedError } from '@errors';

/**
 * Middleware that authenticates incoming requests using JWT strategy via Passport.
 *
 * If authentication fails, it passes an {@link UnauthorizedError} to the next middleware.
 * On success, attaches the authenticated user to the request object.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function to pass control to the next middleware.
 * @returns {void}
 */
export function requireJwt(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) return next(err);

    if (!user) return next(new UnauthorizedError('Unauthorized'));

    req.user = user;

    next();
  })(req, res, next);
}
