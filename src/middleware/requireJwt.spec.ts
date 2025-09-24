import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UnauthorizedError } from '@errors';

import { requireJwt } from './requireJwt';

jest.mock('passport', () => ({ authenticate: jest.fn() }));

type VerifyCallback = (err: unknown, user?: any, info?: any) => void;

describe('requireJwt', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {} as Partial<Request>;
    mockResponse = {} as Partial<Response>;
    nextFunction = jest.fn();
    (passport.authenticate as jest.Mock).mockReset();
  });

  it('should pass the strategy error to next', () => {
    (passport.authenticate as jest.Mock).mockImplementation(
      (_strategy: string, _options: any, verify: VerifyCallback) => {
        return () => {
          verify(new Error('boom'), null, undefined);
        };
      },
    );

    requireJwt(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(passport.authenticate).toHaveBeenCalledWith(
      'jwt',
      { session: false },
      expect.any(Function),
    );
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });

  it('should call next with UnauthorizedError when no user is returned', () => {
    (passport.authenticate as jest.Mock).mockImplementation(
      (_strategy: string, _options: any, verify: VerifyCallback) => {
        return () => {
          verify(null, false, { message: 'No user' });
        };
      },
    );

    requireJwt(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(passport.authenticate).toHaveBeenCalledWith(
      'jwt',
      { session: false },
      expect.any(Function),
    );

    const firstArg = (nextFunction as jest.Mock).mock.calls[0][0];

    expect(firstArg).toBeInstanceOf(UnauthorizedError);
    expect((firstArg as UnauthorizedError).message).toBe('Unauthorized');
  });

  it('should attach the user to req and call next with no args', () => {
    const authenticatedUser = { id: 'u1', email: 'a@b.com', role: 'GUEST' };

    (passport.authenticate as jest.Mock).mockImplementation(
      (_strategy: string, _options: any, verify: VerifyCallback) => {
        return () => {
          verify(null, authenticatedUser, undefined);
        };
      },
    );

    requireJwt(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(passport.authenticate).toHaveBeenCalledWith(
      'jwt',
      { session: false },
      expect.any(Function),
    );
    expect((mockRequest as any).user).toEqual(authenticatedUser);
    expect(nextFunction).toHaveBeenCalledWith();
  });
});
