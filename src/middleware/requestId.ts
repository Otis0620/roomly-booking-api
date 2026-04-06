import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

/**
 * Generates a unique request ID for each incoming request.
 *
 * Attaches the ID to `res.locals.requestId` for use in downstream
 * middleware and the error handler, and sets it as the `X-Request-Id`
 * response header so clients can correlate requests with error responses.
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const id = randomUUID();

  res.locals.requestId = id;
  res.setHeader('X-Request-Id', id);

  next();
}
