import 'reflect-metadata';
import {
  setupTestDatabase,
  clearTestDatabase,
  closeTestDatabase,
} from './src/test/utils/setup-database';

beforeAll(async () => {
  process.env.NODE_ENV = 'test';

  await setupTestDatabase();
});

afterAll(async () => {
  await clearTestDatabase();
  await closeTestDatabase();
});
