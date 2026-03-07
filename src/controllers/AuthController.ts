import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';

import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { AuthService } from '@services/AuthService';

/**
 * Authentication controller.
 *
 * Handles HTTP requests for user registration and login.
 */
@injectable()
export class AuthController {
  /**
   * Creates a new AuthController instance.
   *
   * @param authService - Service for authentication operations
   */
  constructor(@inject(IDENTIFIERS.AuthService) private authService: AuthService) {}

  /**
   * Handles POST /auth/register.
   *
   * @param req - Express request with registration data in body
   * @param res - Express response
   * @param next - Express next function
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: RegisterRequestDTO = req.body;
      const result = await this.authService.register(dto);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles POST /auth/login.
   *
   * @param req - Express request with login data in body
   * @param res - Express response
   * @param next - Express next function
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginRequestDTO = req.body;
      const result = await this.authService.login(dto);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
