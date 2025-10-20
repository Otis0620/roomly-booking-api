import 'reflect-metadata';
import { DataSource, QueryRunner, EntityMetadata } from 'typeorm';

import { AppDataSource } from '@infra/db';

/**
 * Executes a database operation with foreign key checks temporarily disabled.
 *
 * Useful for truncating or clearing tables that have foreign key constraints.
 *
 * @template Result
 * @param {DataSource} dataSource - The TypeORM data source to use.
 * @param {(queryRunner: QueryRunner) => Promise<Result>} executeWithRunner - The operation to execute with foreign key checks disabled.
 * @returns {Promise<Result>} The result of the provided operation.
 */
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

/**
 * Quotes a MySQL table path for use in raw SQL queries.
 *
 * Example:
 * ```ts
 * quoteMySqlTablePath('mydb.users') // => `mydb`.`users`
 * ```
 *
 * @param {string} tablePath - The table path to quote.
 * @returns {string} The quoted table path.
 */
function quoteMySqlTablePath(tablePath: string): string {
  return tablePath
    .split('.')
    .map((segment) => `\`${segment}\``)
    .join('.');
}

/**
 * Truncates all tables corresponding to the given entity metadata.
 *
 * @param {QueryRunner} queryRunner - The active query runner.
 * @param {EntityMetadata[]} entities - List of entities to truncate.
 * @returns {Promise<void>}
 */
async function truncateAllEntitiesMySQL(
  queryRunner: QueryRunner,
  entities: EntityMetadata[],
): Promise<void> {
  for (const entityMetadata of entities) {
    const tableName = quoteMySqlTablePath(entityMetadata.tablePath);

    await queryRunner.query(`TRUNCATE TABLE ${tableName}`);
  }
}

/**
 * Initializes the test database connection.
 *
 * If a connection already exists, it is destroyed and re-initialized.
 *
 * @returns {Promise<DataSource>} The initialized data source.
 * @throws {Error} If the database fails to initialize.
 */
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

/**
 * Closes the test database connection if it is initialized.
 *
 * @returns {Promise<void>}
 */
export const closeTestDatabase = async (): Promise<void> => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
};

/**
 * Clears all data from the test database by truncating all entity tables.
 *
 * Automatically initializes the data source if it is not already initialized,
 * disables foreign key checks during truncation, and re-enables them afterward.
 *
 * @returns {Promise<void>}
 */
export const clearTestDatabase = async (): Promise<void> => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  await withForeignKeyChecksDisabled(AppDataSource, (queryRunner) =>
    truncateAllEntitiesMySQL(queryRunner, AppDataSource.entityMetadatas),
  );
};
