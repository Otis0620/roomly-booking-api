import { validateEnv } from '../../config/env';

/**
 * Global setup for integration tests.
 *
 * Validates environment variables before any test suites run.
 */
validateEnv();
