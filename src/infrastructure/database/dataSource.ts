import 'reflect-metadata';
import '@config/env';
import { DataSource } from 'typeorm';

/**
 * TypeORM data source configuration.
 *
 * Note: Environment variables are read at module load time.
 * For validated access, use getEnv() from @config/env after validateEnv().
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.TYPEORM_HOST || process.env.DB_HOST,
  port: parseInt(process.env.TYPEORM_PORT || process.env.DB_PORT || '3306', 10),
  username: process.env.TYPEORM_USERNAME || process.env.DB_USERNAME,
  password: process.env.TYPEORM_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.TYPEORM_DATABASE || process.env.DB_NAME,
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
