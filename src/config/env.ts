import { config } from 'dotenv';

/**
 * Loads the correct .env file based on NODE_ENV.
 */
function loadEnvFile(): void {
  let envFile: string;

  switch (process.env.NODE_ENV) {
    case 'test':
      envFile = '.env.test';
      break;
    case 'production':
      envFile = '.env.production';
      break;
    default:
      envFile = '.env.dev';
  }

  config({ path: envFile });
}

loadEnvFile();

/**
 * Environment configuration.
 */
export interface EnvConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  TYPEORM_HOST: string;
  TYPEORM_PORT: number;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;
  TYPEORM_SYNCHRONIZE: boolean;
  TYPEORM_LOGGING: boolean;
}

let cachedEnv: EnvConfig | null = null;

/**
 * Validates all required environment variables.
 */
export function validateEnv(): EnvConfig {
  if (cachedEnv) {
    return cachedEnv;
  }

  const errors: string[] = [];

  const NODE_ENV = process.env.NODE_ENV;

  if (!NODE_ENV || !['development', 'production', 'test'].includes(NODE_ENV)) {
    errors.push('NODE_ENV must be one of: development, production, test');
  }

  const PORT = parseInt(process.env.PORT!, 10);

  if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  } else if (JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters for security');
  }

  const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

  if (!JWT_EXPIRES_IN) {
    errors.push('JWT_EXPIRES_IN is required');
  }

  const TYPEORM_HOST = process.env.TYPEORM_HOST;

  if (!TYPEORM_HOST) {
    errors.push('TYPEORM_HOST is required');
  }

  const TYPEORM_PORT = parseInt(process.env.TYPEORM_PORT!, 10);

  if (isNaN(TYPEORM_PORT)) {
    errors.push('TYPEORM_PORT must be a number');
  }

  const TYPEORM_USERNAME = process.env.TYPEORM_USERNAME;

  if (!TYPEORM_USERNAME) {
    errors.push('TYPEORM_USERNAME is required');
  }

  const TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD;

  if (TYPEORM_PASSWORD === undefined) {
    errors.push('TYPEORM_PASSWORD is required');
  }

  const TYPEORM_DATABASE = process.env.TYPEORM_DATABASE;

  if (!TYPEORM_DATABASE) {
    errors.push('TYPEORM_DATABASE is required');
  }

  const TYPEORM_SYNCHRONIZE = process.env.TYPEORM_SYNCHRONIZE === 'true';
  const TYPEORM_LOGGING = process.env.TYPEORM_LOGGING === 'true';

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n  - ${errors.join('\n  - ')}`);
  }

  cachedEnv = {
    NODE_ENV: NODE_ENV as EnvConfig['NODE_ENV'],
    PORT,
    JWT_SECRET: JWT_SECRET!,
    JWT_EXPIRES_IN: JWT_EXPIRES_IN!,
    TYPEORM_HOST: TYPEORM_HOST!,
    TYPEORM_PORT,
    TYPEORM_USERNAME: TYPEORM_USERNAME!,
    TYPEORM_PASSWORD: TYPEORM_PASSWORD!,
    TYPEORM_DATABASE: TYPEORM_DATABASE!,
    TYPEORM_SYNCHRONIZE,
    TYPEORM_LOGGING,
  };

  return cachedEnv;
}

/**
 * Gets the validated environment config.
 */
export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    throw new Error('Environment not validated. Call validateEnv() at startup.');
  }

  return cachedEnv;
}
