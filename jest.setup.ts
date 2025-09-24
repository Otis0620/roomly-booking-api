import 'reflect-metadata';
import {
  setupTestDatabase,
  clearTestDatabase,
  closeTestDatabase,
} from './src/test/utils/setupDatabase';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await clearTestDatabase();
  await closeTestDatabase();
});
