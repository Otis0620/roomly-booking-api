import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

import apiRoutes from '@routes';

import { errorHandler } from '@infra/http/middleware';

// Passport
import '@infra/auth';

const app = express();

app.use(helmet());
app.use(bodyParser.json());

app.use(passport.initialize());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
