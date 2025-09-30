import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { BaseError, HttpError } from '@errors';

export const errorHandler: ErrorRequestHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  if (err instanceof BaseError) {
    res.status(err.status).json({ error: err.message, code: err.status });

    return;
  }

  res.status(500).json({ error: 'Internal Server Error', code: 500 });
};
