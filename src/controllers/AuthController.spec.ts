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

      await authController.register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      });
    });

    it('should call next with an error if passport authentication fails', async () => {
      const authError = new BaseError('Authentication failed', 401);

      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(authError, false, null);
          };
        });

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(authError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if user is not returned', async () => {
      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, false, null);
          };
        });

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with an unexpected error if something goes wrong', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(passport, 'authenticate').mockImplementation(() => {
        throw unexpectedError;
      });

      await authController.register(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(unexpectedError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should respond with token and user on successful login', async () => {
      const user = {
        id: '123',
        email: 'test@example.com',
        role: UserRole.GUEST,
        createdAt: new Date().toISOString(),
      } as UserDTO;

      const token = 'mocked.jwt.token';

      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, { user, token });
          };
        });

      await authController.login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ user, token });
    });

    it('should call next with BadRequestError if result is null', async () => {
      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(null, false);
          };
        });

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error if passport returns an error', async () => {
      const authError = new BaseError('Login failed', 401);

      jest
        .spyOn(passport, 'authenticate')
        .mockImplementation((_strategy: string, _options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (_req: Request, _res: Response, _next: NextFunction) => {
            callback(authError, false);
          };
        });

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(authError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with an unexpected error if something goes wrong', async () => {
      const unexpectedError = new Error('Unexpected error');

      jest.spyOn(passport, 'authenticate').mockImplementation(() => {
        throw unexpectedError;
      });

      await authController.login(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(unexpectedError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
