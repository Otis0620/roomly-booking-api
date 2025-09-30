import 'reflect-metadata';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import { InversifyExpressServer } from 'inversify-express-utils';
import passport from 'passport';
import { DataSource } from 'typeorm';

import { configurePassport } from '@infra/auth';
import { container, DEPENDENCY_IDENTIFIERS } from '@infra/di';
import { errorHandler } from '@infra/http/middleware';

import '@controllers/v1';

(async () => {
  try {
    const dataSource = container.get<DataSource>(DEPENDENCY_IDENTIFIERS.DataSource);

    await dataSource.initialize();

    configurePassport(container);

    const server = new InversifyExpressServer(container, null, { rootPath: '/api' });

    server.setConfig((app) => {
      app.use(helmet());
      app.use(bodyParser.json());
      app.use(passport.initialize());
    });

    server.setErrorConfig((app) => {
      app.use(errorHandler);
    });

    const app = server.build();
    const port = Number(process.env.PORT) || 3000;

    app.listen(port, () => {
      console.log(`Inversify Express server started on port ${port}`);
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
