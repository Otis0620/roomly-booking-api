import {
  BaseError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '@errors/CustomErrors';

describe('CustomErrors', () => {
  describe('BaseError', () => {
    it('should create error with message and status', () => {
      const error = new BaseError('Something went wrong', 500);

      expect(error.message).toBe('Something went wrong');
      expect(error.status).toBe(500);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BaseError);
    });
  });

  describe('BadRequestError', () => {
    it('should have status 400 with default message', () => {
      const error = new BadRequestError();

      expect(error.message).toBe('Bad Request');
      expect(error.status).toBe(400);
      expect(error.details).toBeUndefined();
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new BadRequestError('Invalid input');

      expect(error.message).toBe('Invalid input');
    });

    it('should accept details', () => {
      const details = [{ field: 'email', message: 'Invalid format' }];
      const error = new BadRequestError('Validation failed', details);

      expect(error.details).toEqual(details);
    });

    it('should support generic type for details', () => {
      interface ValidationDetail {
        field: string;
        message: string;
      }

      const details: ValidationDetail[] = [{ field: 'email', message: 'Required' }];
      const error = new BadRequestError<ValidationDetail[]>('Validation failed', details);

      expect(error.details).toEqual(details);
      expect(error.details?.[0].field).toBe('email');
    });
  });

  describe('UnauthorizedError', () => {
    it('should have status 401 with default message', () => {
      const error = new UnauthorizedError();

      expect(error.message).toBe('Unauthorized');
      expect(error.status).toBe(401);
      expect(error).toBeInstanceOf(UnauthorizedError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new UnauthorizedError('Invalid token');

      expect(error.message).toBe('Invalid token');
    });
  });

  describe('ForbiddenError', () => {
    it('should have status 403 with default message', () => {
      const error = new ForbiddenError();

      expect(error.message).toBe('Forbidden');
      expect(error.status).toBe(403);
      expect(error).toBeInstanceOf(ForbiddenError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new ForbiddenError('Access denied');

      expect(error.message).toBe('Access denied');
    });
  });

  describe('NotFoundError', () => {
    it('should have status 404 with default message', () => {
      const error = new NotFoundError();

      expect(error.message).toBe('Not Found');
      expect(error.status).toBe(404);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new NotFoundError('User not found');

      expect(error.message).toBe('User not found');
    });
  });

  describe('ConflictError', () => {
    it('should have status 409 with default message', () => {
      const error = new ConflictError();

      expect(error.message).toBe('Conflict');
      expect(error.status).toBe(409);
      expect(error).toBeInstanceOf(ConflictError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new ConflictError('Email already exists');

      expect(error.message).toBe('Email already exists');
    });
  });

  describe('InternalServerError', () => {
    it('should have status 500 with default message', () => {
      const error = new InternalServerError();

      expect(error.message).toBe('Internal Server Error');
      expect(error.status).toBe(500);
      expect(error).toBeInstanceOf(InternalServerError);
      expect(error).toBeInstanceOf(BaseError);
    });

    it('should accept custom message', () => {
      const error = new InternalServerError('Database connection failed');

      expect(error.message).toBe('Database connection failed');
    });
  });
});
