import { injectable, inject } from 'inversify';

import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { LoginResponseDTO } from '@dtos/auth/LoginResponseDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { RegisterResponseDTO } from '@dtos/auth/RegisterResponseDTO';
import { User } from '@entities/User';
import { BadRequestError, UnauthorizedError } from '@errors/CustomErrors';
import { IDENTIFIERS } from '@infra/di/identifiers';
import type { BcryptManager } from '@lib/crypto/BcryptManager';
import type { JwtManager } from '@lib/jwt/JwtManager';
import type { IUserRepository } from '@repositories/UserRepository';

@injectable()
export class AuthService {
  /**
   * Creates a new AuthService instance.
   *
   * @param userRepository - Repository for user data access
   * @param bcryptManager - Manager for password hashing
   * @param jwtManager - Manager for JWT token operations
   */
  constructor(
    @inject(IDENTIFIERS.UserRepository) private userRepository: IUserRepository,
    @inject(IDENTIFIERS.BcryptManager) private bcryptManager: BcryptManager,
    @inject(IDENTIFIERS.JwtManager) private jwtManager: JwtManager,
  ) {}

  /**
   * Registers a new user account.
   *
   * @param registerDto - Registration data including email, password, firstName, lastName, and optional role
   * @returns The created user as a RegisterResponseDTO
   * @throws {BadRequestError} If a user with the given email already exists
   */
  async register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { email, password, firstName, lastName, role } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError();
    }

    const passwordHash = await this.bcryptManager.hash(password);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      role,
    });

    return this.toRegisterResponseDTO(user);
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @param loginDto - Login credentials including email and password
   * @returns JWT token wrapped in a LoginResponseDTO
   * @throws {UnauthorizedError} If email is not found or password is invalid
   */
  async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedError();
    }

    const isValidPassword = await this.bcryptManager.compare(loginDto.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError();
    }

    if (user.suspended) {
      throw new UnauthorizedError();
    }

    const token = this.jwtManager.sign({ sub: user.id, role: user.role });

    return this.toLoginResponseDTO(token, user);
  }

  /**
   * Converts a User entity and token to a login response DTO.
   *
   * @param token - Signed JWT token
   * @param user - User entity from database
   * @returns Login response data
   */
  private toLoginResponseDTO(token: string, user: User): LoginResponseDTO {
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Converts a User entity to a registration response DTO.
   *
   * @param user - User entity from database
   * @returns Registration response data
   */
  private toRegisterResponseDTO(user: User): RegisterResponseDTO {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
