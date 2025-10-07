import { RequestHandler } from 'express';

import { ForbiddenError } from '@errors';

import { RequestWithUser } from '@infra/http/types';
import { UserRole } from '@lib/types';

/**
 * Middleware factory that restricts access based on user role.
 *
 * @param {...UserRole[]} allowed - The roles permitted to access the route.
 * @returns {RequestHandler} Middleware that checks the user's role and calls next with a ForbiddenError if not allowed.
 */
export const requireRole =
  (...allowed: UserRole[]): RequestHandler =>
  (req: RequestWithUser, _res, next) => {
    const role = req.user?.role as UserRole;

    if (!role || !allowed.includes(role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
