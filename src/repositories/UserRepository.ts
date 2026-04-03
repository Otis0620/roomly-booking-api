import { injectable, inject } from 'inversify';
import type { DataSource, Repository } from 'typeorm';

import { User } from '@entities/User';
import { IDENTIFIERS } from '@infra/di/identifiers';

/**
 * User repository interface.
 */
export interface IUserRepository {
  /**
   * Finds a user by their email address.
   *
   * @param email - The email to search for
   * @returns The user if found, null otherwise
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their email address, including the password hash.
   * Use this only when password verification is required (e.g. login).
   *
   * @param email - The email to search for
   * @returns The user with password hash if found, null otherwise
   */
  findByEmailWithPassword(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique ID.
   *
   * @param id - The user ID to search for
   * @returns The user if found, null otherwise
   */
  findById(id: string): Promise<User | null>;

  /**
   * Creates and persists a new user.
   *
   * @param userData - Partial user data to create
   * @returns The created user with generated ID
   */
  create(userData: Partial<User>): Promise<User>;
}

/**
 * TypeORM implementation of the user repository.
 */
@injectable()
export class UserRepository implements IUserRepository {
  private repository: Repository<User>;

  /**
   * Creates a new UserRepository instance.
   *
   * @param dataSource - TypeORM DataSource injected by InversifyJS
   */
  constructor(@inject(IDENTIFIERS.DataSource) dataSource: DataSource) {
    this.repository = dataSource.getRepository(User);
  }

  /**
   * @inheritdoc
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email });
  }

  /**
   * @inheritdoc
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  /**
   * @inheritdoc
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * @inheritdoc
   */
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);

    return this.repository.save(user);
  }
}
