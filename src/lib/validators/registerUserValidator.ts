import Joi from 'joi';

export const registerUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('guest', 'owner').optional(),
});
