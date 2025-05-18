import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { UserDTO } from '@dtos';
import { User } from '@entities';
import { BadRequestError, BaseError } from '@errors';

import { UserRole } from '@lib/types';

import { AuthController } from './AuthController';

describe('AuthController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let authController: AuthController;

  beforeEach(() => {
    authController = new AuthController();

    req = {
      body: {
        email: 'test@example.com',
        password: 'securepassword',
        role: 'guest',
      },
    } as Partial<Request>;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    it('should respond with success if user is registered', async () => {
      // Arrange
      const userEntity = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.GUEST,
        created_at: new Date('2021-01-01T00:00:00Z'),
      } as User;

      const user = UserDTO.fromEntity(userEntity);

      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, user, null);
          };
        });

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

      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(authError, false, null);
          };
        });

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(authError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if user is not returned', async () => {
      // Arrange
      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, false, null);
          };
        });

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
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
