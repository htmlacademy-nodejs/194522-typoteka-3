'use strict';

const Joi = require(`Joi`);

module.exports = Joi.object({
  text: Joi.string().min(20).required()
});
