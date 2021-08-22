'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  name: Joi.string().min(5).max(30).required()
});
