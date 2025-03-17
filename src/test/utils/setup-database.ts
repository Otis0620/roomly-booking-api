import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { AppDataSource } from '../../../typeorm.config';

export const setupTestDatabase = async (): Promise<DataSource> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    return await AppDataSource.initialize();
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
};

export const closeTestDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};

export const clearDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const entities = AppDataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = AppDataSource.getRepository(entity.name);

    await repository.clear();
  }
};

export const seedDatabase = async (): Promise<void> => {
  // Add your seeding logic here based on your entities
  // Example:
  // const userRepository = AppDataSource.getRepository(User);
  // await userRepository.save({ name: 'Test User', email: 'test@example.com' });
};
