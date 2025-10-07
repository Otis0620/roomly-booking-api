import type { Response, NextFunction } from 'express';

import { ForbiddenError } from '@errors';

import type { RequestWithUser } from '@infra/http/types';
import { UserRole } from '@lib/types';

import { requireRole } from './requireRole';

describe('requireRole', () => {
  let next: NextFunction;

  beforeEach(() => {
    next = jest.fn() as unknown as NextFunction;
  });

  it('should call next without error if user role is allowed', () => {
    const req = { user: { role: UserRole.ADMIN } } as unknown as RequestWithUser;
    const res = {} as Response;

    requireRole(UserRole.ADMIN, UserRole.OWNER)(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with ForbiddenError if user role is not allowed', () => {
    const req = { user: { role: UserRole.GUEST } } as unknown as RequestWithUser;
    const res = {} as Response;

    requireRole(UserRole.ADMIN, UserRole.OWNER)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
    expect((next as jest.Mock).mock.calls[0][0].message).toBe('Insufficient permissions');
  });

  it('should call next with ForbiddenError if user has no role', () => {
    const req = { user: {} } as unknown as RequestWithUser;
    const res = {} as Response;

    requireRole(UserRole.ADMIN)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should call next with ForbiddenError if req.user is missing', () => {
    const req = {} as unknown as RequestWithUser;
    const res = {} as Response;

    requireRole(UserRole.ADMIN)(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });
});
