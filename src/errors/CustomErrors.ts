/**
 * Base error class that extends the native `Error` object.
 *
 * Provides additional properties like HTTP status codes and optional error details.
 */
export class BaseError extends Error {
  /**
   * HTTP status code associated with the error.
   */
  public status: number;

  /**
   * Optional additional details or metadata about the error.
   */
  public details?: any;

  /**
   * Creates a new `BaseError` instance.
   *
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

/**
 * Represents an HTTP 400 Bad Request error.
 */
export class BadRequestError extends BaseError {
  /**
   * @param {string} [message='Bad Request'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * Represents an HTTP 401 Unauthorized error.
 */
export class UnauthorizedError extends BaseError {
  /**
   * @param {string} [message='Unauthorized'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Unauthorized', details?: any) {
    super(message, 401, details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Represents an HTTP 403 Forbidden error.
 */
export class ForbiddenError extends BaseError {
  /**
   * @param {string} [message='Forbidden'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Forbidden', details?: any) {
    super(message, 403, details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Represents an HTTP 404 Not Found error.
 */
export class NotFoundError extends BaseError {
  /**
   * @param {string} [message='Not Found'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Not Found', details?: any) {
    super(message, 404, details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Represents an HTTP 409 Conflict error.
 */
export class ConflictError extends BaseError {
  /**
   * @param {string} [message='Conflict'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Conflict', details?: any) {
    super(message, 409, details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Represents an HTTP 500 Internal Server Error.
 */
export class InternalServerError extends BaseError {
  /**
   * @param {string} [message='Internal Server Error'] - Optional custom error message.
   * @param {any} [details] - Optional additional error details.
   */
  constructor(message = 'Internal Server Error', details?: any) {
    super(message, 500, details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
