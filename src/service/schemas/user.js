'use strict';

const Joi = require(`joi`);

const PASSWORD_MIN_LENGTH = 6;

module.exports = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)),
  avatar: Joi.string(),
  isAdmin: Joi.boolean().required(),
});
