import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { BadRequestError } from '@errors/CustomErrors';

/**
 * Creates validation middleware for request body.
 *
 * Validates the request body against a Joi schema. If validation fails,
 * throws a BadRequestError with details about which fields failed.
 * If validation passes, replaces req.body with the validated/sanitized value.
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
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      }));

      return next(new BadRequestError('Validation failed', details));
    }

    req.body = value;

    next();
  };
}
