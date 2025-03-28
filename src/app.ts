import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

import { errorHandler } from '@middleware';
import apiRoutes from '@routes';

import '@config/passport';

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(passport.initialize());

app.use('/api', apiRoutes);

app.use(errorHandler);

export default app;
