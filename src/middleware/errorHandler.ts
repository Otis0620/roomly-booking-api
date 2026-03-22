import { Request, Response, NextFunction } from 'express';

import { BaseError, BadRequestError } from '@errors/CustomErrors';

/**
 * Global error handler middleware.
 *
 * @param err - The error that was thrown
 * @param _req - Express request (unused)
 * @param res - Express response
 * @param _next - Express next function (unused)
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const requestId = res.locals.requestId as string | undefined;

  if (err instanceof BadRequestError) {
    res.status(err.status).json({
      error: err.message,
      code: err.status,
      requestId,
      ...(err.details && { details: err.details }),
    });

    return;
  }

  if (err instanceof BaseError) {
    res.status(err.status).json({
      error: err.message,
      code: err.status,
      requestId,
    });

    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    code: 500,
    requestId,
  });
}
