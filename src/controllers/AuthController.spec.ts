import { Request, Response, NextFunction } from 'express';

import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { UserRole } from '@lib/types/userTypes';
import { AuthService } from '@services/AuthService';

import { AuthController } from './AuthController';

describe('AuthController', () => {
  let authController: AuthController;
  let mockAuthService: Partial<AuthService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockNext = jest.fn();

    mockAuthService = {
      register: jest.fn(),
    };

    authController = new AuthController(mockAuthService as Partial<AuthService> as AuthService);
  });

  describe('register', () => {
    it('should call authService.register with the request body', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.GUEST,
      };

      mockReq = { body: registerDto };

      await authController.register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should respond with 201 and the result on success', async () => {
      const registerDto: RegisterRequestDTO = {
        email: 'user@example.com',
        password: 'password123',
        role: UserRole.GUEST,
      };

      const result = {
        id: 'user-id-1',
        email: 'user@example.com',
        role: UserRole.GUEST,
        createdAt: new Date().toISOString(),
      };

      mockReq = { body: registerDto };

      (mockAuthService.register as jest.Mock).mockResolvedValueOnce(result);

      await authController.register(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });
  });
});
