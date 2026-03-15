import { injectable, inject } from 'inversify';

import { RegisterRequestDTO } from '@dtos/auth/RegisterRequestDTO';
import { RegisterResponseDTO, toRegisterResponseDTO } from '@dtos/auth/RegisterResponseDTO';
import { BadRequestError } from '@errors/CustomErrors';
import { IDENTIFIERS } from '@infra/di/identifiers';
import { BcryptManager } from '@lib/crypto/BcryptManager';
import { IUserRepository } from '@repositories/UserRepository';

/**
 * Service handling authentication business logic.
 */
@injectable()
export class AuthService {
  private saltRounds = 10;

  /**
   * Creates a new AuthService instance.
   *
   * @param userRepository - Repository for user data access
   * @param bcryptManager - Manager for password hashing
   */
  constructor(
    @inject(IDENTIFIERS.UserRepository) private userRepository: IUserRepository,
    @inject(IDENTIFIERS.BcryptManager) private bcryptManager: BcryptManager,
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

    const passwordHash = await this.bcryptManager.hash(password, this.saltRounds);

    const user = await this.userRepository.create({
      email,
      passwordHash,
      role,
    });

    return toRegisterResponseDTO(user);
  }
}
