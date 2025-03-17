import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { UserDTO } from '@dtos';
import { BadRequestError } from '@errors';
import { IUserRepository } from '@repositories';

import { UserRole } from '@lib/types';

@injectable()
export class AuthService {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async register(email: string, password: string, role: UserRole): Promise<UserDTO> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError();
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create({ email, password_hash: passwordHash, role });

    return UserDTO.fromEntity(user);
  }
}
