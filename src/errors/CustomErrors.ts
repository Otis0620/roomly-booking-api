export class BaseError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, details);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', details?: any) {
    super(message, 401, details);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = 'Forbidden', details?: any) {
    super(message, 403, details);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Not Found', details?: any) {
    super(message, 404, details);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict', details?: any) {
    super(message, 409, details);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = 'Internal Server Error', details?: any) {
    super(message, 500, details);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}
