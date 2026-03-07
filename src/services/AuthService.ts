import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

import { getEnv } from '@config/env';
import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { LoginResponseDTO } from '@dtos/auth/LoginResponseDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { RegisterResponseDTO, toRegisterResponseDTO } from '@dtos/auth/RegisterResponseDTO';
import { User } from '@entities/User';
import { BadRequestError } from '@errors/CustomErrors';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { JwtManager } from '@lib/jwt/JwtManager';
import { UserRole } from '@lib/types/userTypes';
import { IUserRepository } from '@repositories/UserRepository';

/**
 * Authentication service.
 *
 * Handles user registration, login, and token generation.
 */
@injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  /**
   * Creates a new AuthService instance.
   *
   * @param userRepository - Repository for user data access
   * @param cryptoManager - Utility for password hashing
   * @param jwtManager - Utility for JWT operations
   */
  constructor(
    @inject(IDENTIFIERS.UserRepository) private userRepository: IUserRepository,
    @inject(IDENTIFIERS.CryptoManager) private cryptoManager: BcryptManager,
    @inject(IDENTIFIERS.JwtManager) private jwtManager: JwtManager,
  ) {}

  /**
   * Registers a new user.
   *
   * @param dto - Registration request data
   * @returns User details
   * @throws BadRequestError if email is already registered
   */
  async register(dto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { email, password, role } = dto;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError('Unable to create account');
    }

    const passwordHash = await this.cryptoManager.hash(password, this.SALT_ROUNDS);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      role: role || UserRole.GUEST,
    });

    return toRegisterResponseDTO(user);
  }

  /**
   * Authenticates a user with email and password.
   *
   * @param dto - Login request data
   * @returns Token response if valid, null if invalid credentials
   */
  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = dto;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const isValidPassword = await this.cryptoManager.compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new BadRequestError('Invalid email or password');
    }

    const token = this.generateToken(user);

    return { token };
  }

  /**
   * Generates a JWT token for a user.
   *
   * @param user - User to generate token for
   * @returns Signed JWT token
   */
  private generateToken(user: User): string {
    const env = getEnv();

    return this.jwtManager.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }
}
