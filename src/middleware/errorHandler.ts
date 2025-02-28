import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  const statusCode = err.status ?? 500;

  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    code: statusCode,
  });
}
