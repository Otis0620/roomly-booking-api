import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

import { BaseError, HttpError } from '@errors';

/**
 * Global Express error-handling middleware.
 *
 * Converts application errors into standardized HTTP JSON responses.
 * If the error is an instance of {@link BaseError}, its status and message are used.
 * Otherwise, a generic 500 Internal Server Error response is returned.
 *
 * @param {HttpError} err - The error thrown by previous middleware or route handlers.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object used to send the error response.
 * @param {NextFunction} next - Express next function (unused in this handler).
 * @returns {void}
 */
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
