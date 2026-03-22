import 'reflect-metadata';
import { validateEnv } from '@config/env';

import { getDataSource } from './dataSource';

validateEnv();

export default getDataSource();
