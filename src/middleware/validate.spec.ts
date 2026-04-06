import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { BadRequestError } from '@errors/CustomErrors';
import { validate, ValidationDetail } from '@middleware/validate';

describe('validate', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it('should call next when validation passes', () => {
    req.body = { email: 'test@example.com', password: '12345678' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should replace req.body with validated value', () => {
    req.body = { email: 'test@example.com', password: '12345678' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    expect(req.body).toEqual({ email: 'test@example.com', password: '12345678' });
  });

  it('should strip unknown fields', () => {
    req.body = { email: 'test@example.com', password: '12345678', unknown: 'field' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    expect(req.body).toEqual({ email: 'test@example.com', password: '12345678' });
    expect(req.body.unknown).toBeUndefined();
  });

  it('should call next with BadRequestError when validation fails', () => {
    req.body = { email: 'invalid', password: '1234' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it('should include error message', () => {
    req.body = { email: 'invalid' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError<ValidationDetail[]>;

    expect(error.message).toBe('Validation failed');
  });

  it('should include field details in error', () => {
    req.body = { email: 'invalid', password: '1234' };

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError<ValidationDetail[]>;

    expect(error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'email' }),
        expect.objectContaining({ field: 'password' }),
      ]),
    );
  });

  it('should return all validation errors', () => {
    req.body = {};

    const middleware = validate(schema);

    middleware(req as Request, res as Response, next);

    const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError<ValidationDetail[]>;

    expect(error.details).toHaveLength(2);
  });

  it('should handle nested field paths', () => {
    const nestedSchema = Joi.object({
      user: Joi.object({
        email: Joi.string().email().required(),
      }),
    });

    req.body = { user: { email: 'invalid' } };

    const middleware = validate(nestedSchema);

    middleware(req as Request, res as Response, next);

    const error = (next as jest.Mock).mock.calls[0][0] as BadRequestError<ValidationDetail[]>;

    expect(error.details).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: 'user.email' })]),
    );
  });
});
