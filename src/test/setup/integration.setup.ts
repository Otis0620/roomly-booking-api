import 'reflect-metadata';
import { seedUser } from '../seeds/userSeeds';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../utils/setupDatabase';

beforeAll(async () => {
  await setupTestDatabase();
  await clearTestDatabase();
  await seedUser();
});

afterAll(async () => {
  await closeTestDatabase();
});
