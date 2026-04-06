export class BaseError extends Error {
  public status: number;

  /**
   * @param message - Error message
   * @param status - HTTP status code
   */
  constructor(message: string, status: number) {
    super(message);

    this.status = status;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class BadRequestError<T = unknown> extends BaseError {
  public details?: T;

  /**
   * @param message - Error message
   * @param details - Optional validation or error details
   */
  constructor(message = 'Bad Request', details?: T) {
    super(message, 400);

    this.details = details;

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends BaseError {
  /**
   * @param message - Error message
   */
  constructor(message = 'Unauthorized') {
    super(message, 401);

    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends BaseError {
  /**
   * @param message - Error message
   */
  constructor(message = 'Forbidden') {
    super(message, 403);

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends BaseError {
  /**
   * @param message - Error message
   */
  constructor(message = 'Not Found') {
    super(message, 404);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends BaseError {
  /**
   * @param message - Error message
   */
  constructor(message = 'Conflict') {
    super(message, 409);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends BaseError {
  /**
   * @param message - Error message
   */
  constructor(message = 'Internal Server Error') {
    super(message, 500);

    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
