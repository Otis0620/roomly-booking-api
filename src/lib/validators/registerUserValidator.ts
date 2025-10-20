import Joi from 'joi';

/**
 * Joi validation schema for registering a new user.
 *
 * This schema ensures:
 * - `email` is a valid email address and required.
 * - `password` has a minimum length of 6 characters and is required.
 * - `role` is optional and must be either `"guest"` or `"owner"` if provided.
 */
export const registerUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('guest', 'owner').optional(),
});
