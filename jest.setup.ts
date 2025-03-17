import 'reflect-metadata';
import {
  setupTestDatabase,
  clearDatabase,
  closeTestDatabase,
} from './src/test/utils/setup-database';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  await setupTestDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeTestDatabase();
});
