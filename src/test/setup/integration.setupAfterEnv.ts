import 'reflect-metadata';
import { seedUser } from '../seeds/userSeeds';
import { setupTestDatabase, clearTestDatabase, closeTestDatabase } from '../utils/setupDatabase';
import { testDataSource } from '../utils/testDataSource';

beforeAll(async () => {
  await setupTestDatabase(testDataSource);
  await clearTestDatabase(testDataSource);
  await seedUser(testDataSource);
});

afterAll(async () => {
  await clearTestDatabase(testDataSource);
  await closeTestDatabase(testDataSource);
});
