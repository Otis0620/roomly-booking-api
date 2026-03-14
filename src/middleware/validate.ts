import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { BadRequestError } from '@errors/CustomErrors';

/**
 * Validation error detail.
 */
export interface ValidationDetail {
  field: string;
  message: string;
}

/**
 * Creates validation middleware for request body.
 *
 * @param schema - Joi schema to validate against
 * @returns Express middleware function
 */
export function validate(schema: Joi.Schema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const details: ValidationDetail[] = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new BadRequestError<ValidationDetail[]>('Validation failed', details));
    }

    req.body = value;
    next();
  };
}
