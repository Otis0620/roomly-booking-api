import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
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

  it('should handle errors with custom status code and message', () => {
    // Arrange
    const mockError: HttpError = new Error('Not Found') as HttpError;
    mockError.status = 404;

    // Act
    errorHandler(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Not Found',
      code: 404,
    });
  });

  it('should handle errors with default 500 status code when status is missing', () => {
    // Arrange
    const mockError: HttpError = new Error('Something went wrong') as HttpError;

    // Act
    errorHandler(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Something went wrong',
      code: 500,
    });
  });

  it('should use default error message when message is missing', () => {
    // Arrange
    const mockError: HttpError = new Error() as HttpError;

    // Act
    errorHandler(mockError, mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
      code: 500,
    });
  });
});
