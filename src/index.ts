import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

import { errorHandler } from '@middleware';
import apiRoutes from '@routes';

import { AppDataSource } from './data-source';

import './config/passport';

AppDataSource.initialize()
  .then(() => {
    const app = express();

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(errorHandler);

    app.use('/api', apiRoutes);

    app.listen(3000, () => {
      console.log('Express server has started on port 3000');
    });
  })
  .catch((error) => console.error('Error initializing data source:', error));
