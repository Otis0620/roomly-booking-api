import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { getEnv } from '@config/env';

let dataSource: DataSource | null = null;

/**
 * Returns the TypeORM data source, creating it on first call.
 *
 * Must be called after validateEnv() has run.
 */
export function getDataSource(): DataSource {
  if (!dataSource) {
    const env = getEnv();

    dataSource = new DataSource({
      type: 'mysql',
      host: env.TYPEORM_HOST,
      port: env.TYPEORM_PORT,
      username: env.TYPEORM_USERNAME,
      password: env.TYPEORM_PASSWORD,
      database: env.TYPEORM_DATABASE,
      synchronize: env.TYPEORM_SYNCHRONIZE,
      logging: env.TYPEORM_LOGGING,
      entities: ['src/entities/**/*.ts'],
      migrations: ['src/migrations/**/*.ts'],
      subscribers: [],
    });
  }

  return dataSource;
}
