import bcrypt from 'bcrypt';

import { User } from '@entities/User';
import { AppDataSource } from '@infra/database/dataSource';
import { UserRole } from '@lib/types/userTypes';

const DEFAULT_PASSWORD = 'password123';
const SALT_ROUNDS = 10;

/**
 * Seeds a single user into the test database.
 *
 * @param overrides - Optional partial User fields to override defaults
 * @returns The created User entity
 */
export const seedUser = async (overrides: Partial<User> = {}): Promise<User> => {
  const repository = AppDataSource.getRepository(User);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const user = repository.create({
    email: 'existing@example.com',
    passwordHash,
    role: UserRole.GUEST,
    ...overrides,
  });

  return repository.save(user);
};

/**
 * Seeds multiple users into the test database.
 *
 * @param count - Number of users to create
 * @param overrides - Optional partial User fields to override defaults
 * @returns Array of created User entities
 */
export const seedUsers = async (count: number, overrides: Partial<User> = {}): Promise<User[]> => {
  const users: User[] = [];

  for (const index of Array.from({ length: count }, (_, i) => i)) {
    users.push(await seedUser({ email: `user${index}@example.com`, ...overrides }));
  }

  return users;
};
