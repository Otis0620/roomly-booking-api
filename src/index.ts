import 'reflect-metadata';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { DataSource } from 'typeorm';

import { configurePassport, default as passport } from '@infra/auth';
import { container, DEPENDENCY_IDENTIFIERS } from '@infra/di';
import { createHttpServer } from '@infra/http/adapters';
import { errorHandler } from '@infra/http/middleware';

import '@controllers/v1';

(async () => {
  try {
    const dataSource = container.get<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource);

    await dataSource.initialize();

    configurePassport(container);

    const app = createHttpServer(container, {
      rootPath: '/api',
      configure: (expressApp) => {
        expressApp.use(helmet());
        expressApp.use(bodyParser.json());
        expressApp.use(passport.initialize());
      },
      configureError: (expressApp) => {
        expressApp.use(errorHandler);
      },
    });

    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => {
      console.log(`HTTP server started on port ${port}`);
    });

    process.on('SIGINT', async () => {
      console.log('Shutting down...');

      if (dataSource.isInitialized) {
        try {
          await dataSource.destroy();

          console.log('Data source destroyed successfully');
        } catch (err) {
          console.warn('Error destroying data source during shutdown:', err);
        }
      }

      process.exit(0);
    });
  } catch (error) {
    console.error('Error during bootstrap:', error);

    process.exit(1);
  }
})();
