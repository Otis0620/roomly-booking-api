import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UserRole } from '@lib/types';

import { UserDTO } from '@dtos';
import { User } from '@entities';
import { BadRequestError, BaseError } from '@errors';

import { AuthController } from './AuthController';

jest.mock('passport');

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();

    req = {} as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('register', () => {
    it('should respond with success if user is registered', async () => {
      // Arrange
      const user = UserDTO.fromEntity({
        id: '123',
        email: 'test@example.com',
        role: UserRole.GUEST,
        created_at: new Date('2021-01-01T00:00:00Z'),
      } as User);

      (passport.authenticate as jest.Mock).mockImplementation(
        (_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, user, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    });

    it('should call next with an error if passport authentication fails', async () => {
      // Arrange
      const authError = new BaseError('Authentication failed', 401);

      (passport.authenticate as jest.Mock).mockImplementation(
        (_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(authError, false, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(authError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if user is not returned', async () => {
      // Arrange
      (passport.authenticate as jest.Mock).mockImplementation(
        (_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, false, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(new BadRequestError('Registration failed'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with an unexpected error if something goes wrong', async () => {
      // Arrange
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(passport, 'authenticate').mockImplementation(() => {
        throw unexpectedError;
      });

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(unexpectedError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
