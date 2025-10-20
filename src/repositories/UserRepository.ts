import { injectable, inject } from 'inversify';
import { DataSource, Repository } from 'typeorm';

import { User } from '@entities';

import { DEPENDENCY_IDENTIFIERS } from '@infra/di';

import { IUserRepository } from './IUserRepository';

/**
 * Repository implementation for {@link User} entities.
 *
 */
@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  /**
   * Creates a new `UserRepository` instance.
   *
   * @param {DataSource} repository - The TypeORM data source injected via DI.
   */
  constructor(@inject(DEPENDENCY_IDENTIFIERS.DataSource) repository: DataSource) {
    this.repository = repository.getRepository(User);
  }

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user if found, or `null` otherwise.
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOneBy({ email });
  }

  /**
   * Finds a user by their unique ID.
   *
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user if found, or `null` otherwise.
   */
  async findById(id: string): Promise<User | null> {
    return await this.repository.findOneBy({ id });
  }

  /**
   * Creates and saves a new user record in the database.
   *
   * @param {Partial<User>} userData - The data to create the user with.
   * @returns {Promise<User>} A promise that resolves to the newly created user.
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);

    return await this.repository.save(user);
  }
}
