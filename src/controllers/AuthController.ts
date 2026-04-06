import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { IDENTIFIERS } from '@infra/di/identifiers';
import type { AuthService } from '@services/AuthService';

@injectable()
export class AuthController {
  /**
   * @param authService - Service for authentication operations
   */
  constructor(@inject(IDENTIFIERS.AuthService) private authService: AuthService) {}

  /**
   * Handles POST /api/v1/auth/register.
   *
   * @param req - Express request with registration data in body
   * @param res - Express response
   * @param next - Express next function
   * @returns Resolves when the response has been sent
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const registerDto: RegisterRequestDTO = req.body;
      const result = await this.authService.register(registerDto);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles POST /api/v1/auth/login.
   *
   * @param req - Express request with login data in body
   * @param res - Express response
   * @param next - Express next function
   * @returns Resolves when the response has been sent
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const loginDto: LoginRequestDTO = req.body;
      const result = await this.authService.login(loginDto);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
