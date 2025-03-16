import 'reflect-metadata';
import { config as configureEnvironment } from 'dotenv';
import { DataSource } from 'typeorm';

configureEnvironment({ path: '.env.test' });

export const TestDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '3306', 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});

export const setupTestDatabase = async (): Promise<DataSource> => {
  try {
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
    }

    return await TestDataSource.initialize();
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
};

// Helper function to close the test database connection
export const closeTestDatabase = async (): Promise<void> => {
  if (TestDataSource.isInitialized) {
    await TestDataSource.destroy();
  }
};

// Helper function to clear all tables between tests
export const clearDatabase = async (): Promise<void> => {
  if (!TestDataSource.isInitialized) {
    await TestDataSource.initialize();
  }

  const entities = TestDataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = TestDataSource.getRepository(entity.name);

    await repository.clear();
  }
};

// Helper to seed the database with test data
export const seedDatabase = async (): Promise<void> => {
  // Add your seeding logic here based on your entities
  // Example:
  // const userRepository = TestDataSource.getRepository(User);
  // await userRepository.save({ name: 'Test User', email: 'test@example.com' });
};
