import { DataSource } from 'typeorm';

import { validateEnv } from '@config/env';
import { buildDataSourceConfig } from '@infra/database/buildDataSourceConfig';

const env = validateEnv();

/**
 * Shared TypeORM DataSource for integration tests.
 *
 * Module-level singleton — all test files that import this share the same
 * instance. Initialized and torn down by the global test setup file.
 */
export const testDataSource = new DataSource(buildDataSourceConfig(env));
