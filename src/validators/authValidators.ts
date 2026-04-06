import Joi from 'joi';

import { UserRole } from '@lib/types/userTypes';

/**
 * Joi schema for user registration.
 *
 * Validates:
 * - email: Required, valid email format
 * - password: Required, 8-100 characters
 * - firstName: Required
 * - lastName: Required
 * - role: Optional, must be 'guest' or 'owner'
 */
export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(8).max(100).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 100 characters',
    'any.required': 'Password is required',
  }),

  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required',
  }),

  role: Joi.string().valid(UserRole.GUEST, UserRole.OWNER).optional().messages({
    'any.only': 'Role must be either guest or owner',
  }),
});

/**
 * Joi schema for user login.
 *
 * Validates:
 * - email: Required, valid email format
 * - password: Required
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
