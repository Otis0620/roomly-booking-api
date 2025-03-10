import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';

import { DEPENDENCY_IDENTIFIERS } from '@config';
import { User } from '@entities';
import { UserRole } from '@enums';
import { ConflictError } from '@errors';
import { IUserRepository } from '@repositories';

@injectable()
export class AuthService {
  constructor(
    @inject(DEPENDENCY_IDENTIFIERS.IUserRepository) private userRepository: IUserRepository,
  ) {}

  async register(email: string, password: string, role: UserRole): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create({ email, password_hash, role });

    return user;
  }
}
