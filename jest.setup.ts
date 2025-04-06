import 'reflect-metadata';
import {
  setupTestDatabase,
  clearTestDatabase,
  closeTestDatabase,
} from './src/test/utils/setup-database';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await clearTestDatabase();
  await closeTestDatabase();
});
