import { Request, Response, NextFunction } from 'express';

import { BaseError, BadRequestError, UnauthorizedError, NotFoundError } from '@errors/CustomErrors';
import { errorHandler } from '@middleware/errorHandler';

describe('errorHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      locals: { requestId: 'test-request-id' },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should handle BadRequestError with details', () => {
    const details = [{ field: 'email', message: 'Invalid format' }];
    const error = new BadRequestError('Validation failed', details);

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      code: 400,
      requestId: 'test-request-id',
      details,
    });
  });

  it('should handle BadRequestError without details', () => {
    const error = new BadRequestError('Invalid input');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid input',
      code: 400,
      requestId: 'test-request-id',
    });
  });

  it('should handle BaseError', () => {
    const error = new BaseError('Something went wrong', 418);

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
      code: 418,
      requestId: 'test-request-id',
    });
  });

  it('should handle UnauthorizedError', () => {
    const error = new UnauthorizedError('Invalid token');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid token',
      code: 401,
      requestId: 'test-request-id',
    });
  });

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('User not found');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
      code: 404,
      requestId: 'test-request-id',
    });
  });

  it('should return 500 for generic Error', () => {
    const error = new Error('Unexpected error');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      code: 500,
      requestId: 'test-request-id',
    });
  });

  it('should not leak error details for unknown errors', () => {
    const error = new Error('Database connection failed');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.json).not.toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Database connection failed' }),
    );
  });

  it('should include requestId as undefined when not set', () => {
    res = {
      locals: {},
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const error = new NotFoundError('Not found');

    errorHandler(error, req as Request, res as Response, next);

    expect(res.json).toHaveBeenCalledWith({
      error: 'Not found',
      code: 404,
      requestId: undefined,
    });
  });
});
