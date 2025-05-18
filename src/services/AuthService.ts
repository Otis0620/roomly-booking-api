import { inject, injectable } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { ICryptoManager } from '@lib/crypto';
import { UserRole } from '@lib/types';

@injectable()
export class AuthService {
  private readonly saltRounds: number = 10;

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
}
