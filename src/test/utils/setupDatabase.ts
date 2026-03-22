import 'reflect-metadata';
import { DataSource, QueryRunner, EntityMetadata } from 'typeorm';

/**
 * Executes a database operation with foreign key checks temporarily disabled.
 *
 * Useful for truncating or clearing tables that have foreign key constraints.
 *
 * @template Result
 * @param dataSource - The TypeORM data source to use
 * @param executeWithRunner - The operation to execute with foreign key checks disabled
 * @returns The result of the provided operation
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
 * @example
 * quoteMySqlTablePath('mydb.users') // => `mydb`.`users`
 *
 * @param tablePath - The table path to quote
 * @returns The quoted table path
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
 * @param queryRunner - The active query runner
 * @param entities - List of entities to truncate
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
 * If a connection already exists it is destroyed and re-initialized.
 *
 * @param dataSource - The TypeORM data source to initialize
 * @returns The initialized data source
 * @throws If the database fails to initialize
 */
export async function setupTestDatabase(dataSource: DataSource): Promise<DataSource> {
  try {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }

    return await dataSource.initialize();
  } catch (error) {
    console.error('Error initializing test database:', error);
    throw error;
  }
}

/**
 * Closes the test database connection if it is initialized.
 *
 * @param dataSource - The TypeORM data source to close
 */
export async function closeTestDatabase(dataSource: DataSource): Promise<void> {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

/**
 * Clears all data from the test database by truncating all entity tables.
 *
 * Disables foreign key checks during truncation and re-enables them afterward.
 *
 * @param dataSource - The TypeORM data source to clear
 */
export async function clearTestDatabase(dataSource: DataSource): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  await withForeignKeyChecksDisabled(dataSource, (queryRunner) =>
    truncateAllEntitiesMySQL(queryRunner, dataSource.entityMetadatas),
  );
}
