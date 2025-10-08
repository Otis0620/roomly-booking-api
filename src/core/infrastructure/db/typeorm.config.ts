import 'reflect-metadata';
import { config as configureEnvironment } from 'dotenv';
import { DataSource } from 'typeorm';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev';

configureEnvironment({ path: envFile });

/**
 * TypeORM data source configuration for the application.
 *
 * Loads environment variables from `.env.dev` or `.env.test` depending on `NODE_ENV`.
 * Provides connection settings for a MySQL database, including entity and migration paths.
 *
 * @constant
 * @type {DataSource}
 *
 * @property {string} type - The database type (MySQL).
 * @property {string} host - The database host address.
 * @property {number} port - The database port number.
 * @property {string} username - The database username.
 * @property {string} password - The database password.
 * @property {string} database - The database name.
 * @property {boolean} synchronize - Whether to auto-sync the database schema.
 * @property {boolean} logging - Whether to enable query logging.
 * @property {string[]} entities - Paths to entity definition files.
 * @property {string[]} migrations - Paths to migration files.
 * @property {string[]} subscribers - Paths to subscriber files.
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '3306', 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
