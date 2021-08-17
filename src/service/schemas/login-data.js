'use strict';

const Joi = require(`Joi`);

module.exports = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
