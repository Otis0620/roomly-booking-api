import { DataSource } from 'typeorm';

import { validateEnv } from '@config/env';
import { buildDataSourceConfig } from '@infra/database/buildDataSourceConfig';

const env = validateEnv();

/**
 * TypeORM DataSource for the TypeORM CLI.
 *
 * Used exclusively by migration commands (migration:generate, migration:run,
 * migration:revert). Not used by the application at runtime — the app
 * creates and initializes its own DataSource in index.ts.
 */
export const AppDataSource = new DataSource(buildDataSourceConfig(env));
