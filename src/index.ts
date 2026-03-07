import 'reflect-metadata';
import { validateEnv } from '@config/env';
import { configurePassport } from '@infra/auth/passport';
import { AppDataSource } from '@infra/database/dataSource';
import { createContainer } from '@infra/di/container';

import { createApp } from './app';

/**
 * Application entry point.
 */
async function main(): Promise<void> {
  const env = validateEnv();

  await AppDataSource.initialize();
  console.log('✓ Database connected');

  const container = createContainer();

  configurePassport(container);
  const app = createApp(container);

  const server = app.listen(env.PORT, () => {
    console.log(`✓ Server running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    server.close(async () => {
      console.log('✓ HTTP server closed');

      await AppDataSource.destroy();
      console.log('✓ Database connection closed');

      process.exit(0);
    });

    setTimeout(() => {
      console.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

main().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
