import 'reflect-metadata';
import { DataSource, QueryRunner, EntityMetadata } from 'typeorm';

import { AppDataSource } from '@infra/db';

async function withForeignKeyChecksDisabled<Result>(
  dataSource: DataSource,
  executeWithRunner: (queryRunner: QueryRunner) => Promise<Result>,
): Promise<Result> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.query('SET FOREIGN_KEY_CHECKS=0');

    return await executeWithRunner(queryRunner);
  } finally {
    try {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS=1');
    } finally {
      await queryRunner.release();
    }
  }
}

function quoteMySqlTablePath(tablePath: string): string {
  return tablePath
    .split('.')
    .map((segment) => `\`${segment}\``)
    .join('.');
}

async function truncateAllEntitiesMySQL(
  queryRunner: QueryRunner,
  entities: EntityMetadata[],
): Promise<void> {
  for (const entityMetadata of entities) {
    const tableName = quoteMySqlTablePath(entityMetadata.tablePath);

    await queryRunner.query(`TRUNCATE TABLE ${tableName}`);
  }
}

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

export const clearTestDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await withForeignKeyChecksDisabled(AppDataSource, (queryRunner) =>
    truncateAllEntitiesMySQL(queryRunner, AppDataSource.entityMetadatas),
  );
};
