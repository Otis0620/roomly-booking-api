import { Request, Response, NextFunction } from 'express';

import { BaseError, HttpError } from '@errors';

import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should handle errors with custom status code and message when instance of BaseError', () => {
    const mockError: HttpError = new BaseError('Not Found', 404) as HttpError;

    errorHandler(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not Found',
      code: 404,
    });
  });

  it('should handle errors with default 500 status code when not an instance of BaseError', () => {
    const mockError: HttpError = new Error('Something went wrong') as HttpError;

    errorHandler(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      code: 500,
    });
  });
});
