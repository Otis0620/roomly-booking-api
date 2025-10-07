import { RequestHandler } from 'express';

import { ForbiddenError } from '@errors';

import { RequestWithUser } from '@infra/http/types';
import { UserRole } from '@lib/types';

export const requireRole =
  (...allowed: UserRole[]): RequestHandler =>
  (req: RequestWithUser, _res, next) => {
    const role = req.user?.role as UserRole;

    if (!role || !allowed.includes(role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
