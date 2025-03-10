import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

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
      const user = {
        id: '123',
        email: 'test@example.com',
        role: 'user',
        created_at: '2025-03-09T00:00:00Z',
      };

      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy: string, options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (req: Request, res: Response, next: NextFunction) => {
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
        createdAt: user.created_at,
      });
    });

    it('should return a 500 error if an error occurs with error message if an error message is provided', async () => {
      // Arrange
      const error = new Error('Internal Server Error');

      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy: string, options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (req: Request, res: Response, next: NextFunction) => {
            callback(error, null, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message, code: 500 });
    });

    it('should return a 500 error if an error occurs with default message if an error message is not provided', async () => {
      // Arrange
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy: string, options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (req: Request, res: Response, next: NextFunction) => {
            callback(new Error(), null, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed', code: 500 });
    });

    it('should return a 400 error with info message if user is not registered and info message is provided', async () => {
      // Arrange
      const info = { message: 'User already exists' };

      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy: string, options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (req: Request, res: Response, next: NextFunction) => {
            callback(null, null, info);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: info.message, code: 400 });
    });

    it('should return a 400 error and default message if user is not registered and info message is not provided', async () => {
      // Arrange
      (passport.authenticate as jest.Mock).mockImplementation(
        (strategy: string, options: any, callback: Function) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (req: Request, res: Response, next: NextFunction) => {
            callback(null, null, null);
          };
        },
      );

      // Act
      await authController.register(req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed', code: 400 });
    });
  });
});
