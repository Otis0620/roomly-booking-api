import bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

import { User } from '@entities/User';
import { UserRole } from '@lib/types/userTypes';

const DEFAULT_PASSWORD = '12345678';
const SALT_ROUNDS = 10;

/**
 * Seeds a single user into the test database.
 *
 * @param dataSource - The TypeORM data source to use
 * @param overrides - Optional partial User fields to override defaults
 * @returns The created User entity
 */
export async function seedUser(
  dataSource: DataSource,
  overrides: Partial<User> = {},
): Promise<User> {
  const repository = dataSource.getRepository(User);
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const user = repository.create({
    email: 'existing@example.com',
    firstName: 'James',
    lastName: 'Brown',
    passwordHash,
    role: UserRole.guest,
    ...overrides,
  });

  return repository.save(user);
}

/**
 * Seeds multiple users into the test database.
 *
 * @param dataSource - The TypeORM data source to use
 * @param count - Number of users to create
 * @param overrides - Optional partial User fields to override defaults
 * @returns Array of created User entities
 */
export async function seedUsers(
  dataSource: DataSource,
  count: number,
  overrides: Partial<User> = {},
): Promise<User[]> {
  const users: User[] = [];

  for (const index of Array.from({ length: count }, (_, i) => i)) {
    users.push(await seedUser(dataSource, { email: `user${index}@example.com`, ...overrides }));
  }

  return users;
}
