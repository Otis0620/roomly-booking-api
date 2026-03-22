import { injectable, inject } from 'inversify';

import { LoginRequestDTO } from '@dtos/auth/LoginRequestDTO';
import { LoginResponseDTO } from '@dtos/auth/LoginResponseDTO';
import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { RegisterResponseDTO, toRegisterResponseDTO } from '@dtos/auth/RegisterResponseDTO';
import { BadRequestError, UnauthorizedError } from '@errors/CustomErrors';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { JwtManager } from '@lib/jwt/JwtManager';
import { IUserRepository } from '@repositories/UserRepository';

/**
 * Service handling authentication business logic.
 */
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
   * @param registerDto - Registration data including email, password, and optional role
   * @returns The created user as a RegisterResponseDTO
   * @throws {BadRequestError} If a user with the given email already exists
   */
  async register(registerDto: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const { email, password, role } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError();
    }

    const passwordHash = await this.bcryptManager.hash(password);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      role,
    });

    return toRegisterResponseDTO(user);
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

    return { token };
  }
}
