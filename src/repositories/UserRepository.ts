import { injectable, inject } from 'inversify';
import { DataSource, Repository } from 'typeorm';

import { User } from '@entities';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';

import { IUserRepository } from './IUserRepository';

@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  constructor(@inject(DEPENDENCY_IDENTIFIERS.DataSource) repository: DataSource) {
    this.repository = repository.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);

    return await this.repository.save(user);
  }
}
