import { inject, injectable } from 'inversify';

import { UserDTO } from '@dtos';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';
import { ICryptoManager } from '@lib/crypto';
import { IJwtManager } from '@lib/jwt';
import { AuthUser, UserRole } from '@lib/types';

/**
 * Service responsible for handling user authentication logic,
 * including registration and login.
 *
 * - Hashes passwords using {@link ICryptoManager}.
 * - Generates JWT tokens using {@link IJwtManager}.
 * - Persists and retrieves users through {@link IUserRepository}.
 */
@injectable()
export class AuthService {
  private readonly saltRounds: number = 10;
  private readonly loginExpiration: string = '1h';

  /**
   * @param {IUserRepository} userRepository - Repository for user data access.
   * @param {ICryptoManager} cryptoManager - Cryptographic manager for hashing and comparing passwords.
   * @param {IJwtManager} jwtManager - JWT manager for signing tokens.
   */
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
    @inject(DEPENDENCY_IDENTIFIERS.ICryptoManager) private cryptoManager: ICryptoManager,
    @inject(DEPENDENCY_IDENTIFIERS.IJwtManager) private jwtManager: IJwtManager,
  ) {}

  /**
   * Registers a new user.
   *
   * @param {string} email - Email address of the new user.
   * @param {string} password - Plaintext password to hash and store.
   * @param {UserRole} role - Role to assign to the user.
   * @returns {Promise<AuthUser>} The newly created authenticated user object.
   * @throws {BadRequestError} If the email is already registered.
   */
  async register(email: string, password: string, role: UserRole): Promise<AuthUser> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError();
    }

    const passwordHash = await this.cryptoManager.hash(password, this.saltRounds);
    const user = await this.userRepository.create({ email, password_hash: passwordHash, role });

    return { user: UserDTO.fromEntity(user) };
  }

  /**
   * Authenticates a user by verifying their credentials.
   *
   * @param {string} email - User's email address.
   * @param {string} password - Plaintext password to verify.
   * @returns {Promise<AuthUser | null>} The authenticated user and token, or `null` if invalid credentials.
   */
  async login(email: string, password: string): Promise<AuthUser> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await this.cryptoManager.compare(password, user.password_hash);

    if (!isValidPassword) {
      return null;
    }

    const userDTO = UserDTO.fromEntity(user);

    const token = this.jwtManager.sign(
      { id: userDTO.id, role: userDTO.role },
      process.env.JWT_SECRET!,
      { expiresIn: this.loginExpiration },
    );

    return { user: userDTO, token };
  }
}
