import { DataSource } from 'typeorm';

import { EnvConfig } from '@config/env';

/**
 * Builds the TypeORM DataSource configuration from validated env config.
 *
 * @param env - Validated environment configuration from validateEnv()
 */
export function buildDataSourceConfig(env: EnvConfig): ConstructorParameters<typeof DataSource>[0] {
  return {
    type: 'mysql',
    host: env.TYPEORM_HOST,
    port: env.TYPEORM_PORT,
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    database: env.TYPEORM_DATABASE,
    synchronize: env.TYPEORM_SYNCHRONIZE,
    logging: env.TYPEORM_LOGGING,
    entities: ['src/entities/**/*.ts'],
    migrations: ['src/migrations/*.ts'],
  };
}
