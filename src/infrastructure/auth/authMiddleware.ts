import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { ForbiddenError, UnauthorizedError } from '@errors/CustomErrors';
import { UserRole } from '@lib/types/userTypes';

/**
 * Middleware that requires a valid JWT token.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error | null, user: Express.User | false) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return next(new UnauthorizedError('Invalid or expired token'));
      }

      req.user = user;

      next();
    },
  )(req, res, next);
}

/**
 * Middleware factory that restricts access to specific user roles.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new ForbiddenError(`Access denied. Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
}
