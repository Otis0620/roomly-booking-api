import { User } from '@entities';

/**
 * Interface defining the contract for a User repository.
 *
 * Provides methods for retrieving and creating user records.
 * This abstraction allows different data access implementations (e.g., TypeORM, in-memory, mock).
 */
export interface IUserRepository {
  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user if found, or `null` if no user exists with the given email.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their unique ID.
   *
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User | null>} A promise that resolves to the user if found, or `null` if no user exists with the given ID.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Creates and persists a new user record.
   *
   * @param {Partial<User>} userData - The data to create the user with.
   * @returns {Promise<User>} A promise that resolves to the newly created user.
   */
  create(userData: Partial<User>): Promise<User>;
}
