import { inject, injectable } from 'inversify';
import jwt from 'jsonwebtoken';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { ICryptoManager } from '@lib/crypto';
import { UserLoginResponse, UserRole } from '@lib/types';

@injectable()
export class AuthService {
  private readonly saltRounds: number = 10;
  private readonly loginExpiration: string = '1h';

  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
    @inject(DEPENDENCY_IDENTIFIERS.ICryptoManager) private cryptoManager: ICryptoManager,
  ) {}

  async register(email: string, password: string, role: UserRole): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError();
    }

    const passwordHash = await this.cryptoManager.hash(password, this.saltRounds);

    const user = await this.userRepository.create({ email, password_hash: passwordHash, role });

    return UserDTO.fromEntity(user);
  }

  async login(email: string, password: string): Promise<UserLoginResponse | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) return null;

    const isValidPassword = await this.cryptoManager.compare(password, user.password_hash);

    if (!isValidPassword) return null;

    const userDTO = UserDTO.fromEntity(user);

    const token = jwt.sign({ id: userDTO.id, role: userDTO.role }, process.env.JWT_SECRET, {
      expiresIn: this.loginExpiration,
    });

    return { user: userDTO, token };
  }
}
