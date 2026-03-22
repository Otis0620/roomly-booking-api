import { Request, Response, NextFunction } from 'express';

import { requestId } from '@middleware/requestId';

describe('requestId', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      locals: {},
      setHeader: jest.fn(),
    };
    next = jest.fn();
  });

  it('should set requestId on res.locals', () => {
    requestId(req as Request, res as Response, next);

    expect(res.locals!.requestId).toBeDefined();
  });

  it('should set X-Request-Id header', () => {
    requestId(req as Request, res as Response, next);

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', res.locals!.requestId);
  });

  it('should set a valid UUID', () => {
    requestId(req as Request, res as Response, next);

    expect(res.locals!.requestId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
  });

  it('should generate a unique id per request', () => {
    const res2: Partial<Response> = { locals: {}, setHeader: jest.fn() };

    requestId(req as Request, res as Response, next);
    requestId(req as Request, res2 as Response, next);

    expect(res.locals!.requestId).not.toBe(res2.locals!.requestId);
  });

  it('should call next', () => {
    requestId(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should set the same id on locals and the header', () => {
    requestId(req as Request, res as Response, next);

    const id = res.locals!.requestId as string;

    expect(res.setHeader).toHaveBeenCalledWith('X-Request-Id', id);
  });
});
