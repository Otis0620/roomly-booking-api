import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { validateEnv } from '@config/env';
import { buildDataSourceConfig } from '@infra/database/buildDataSourceConfig';
import { createContainer } from '@infra/di/container';

import { createApp } from './app';

/**
 * Bootstraps the application by initialising the database connection,
 * building the IoC container, starting the HTTP server, and registering
 * graceful shutdown handlers for SIGTERM and SIGINT.
 *
 * @returns Resolves when the server is listening
 */
async function main(): Promise<void> {
  const env = validateEnv();

  const dataSource = new DataSource(buildDataSourceConfig(env));

  await dataSource.initialize();
  console.log('✓ Database connected');

  const container = createContainer({ dataSource });

  const app = createApp(container);

  const server = app.listen(env.PORT, () => {
    console.log(`✓ Server running on port ${env.PORT}`);
    console.log(`  Environment: ${env.NODE_ENV}`);
  });

  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received, shutting down gracefully...`);

    server.close(async () => {
      console.log('✓ HTTP server closed');

      await dataSource.destroy();
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
