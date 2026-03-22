import { DataSource } from 'typeorm';

import { validateEnv } from '@config/env';
import { buildDataSourceConfig } from '@infra/database/buildDataSourceConfig';

const env = validateEnv();

export const testDataSource = new DataSource(buildDataSourceConfig(env));
