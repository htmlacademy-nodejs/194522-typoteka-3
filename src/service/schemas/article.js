'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  announce: Joi.string().min(30).max(250).required(),
  categories: Joi.array().required(),
  text: Joi.string().max(1000),
  title: Joi.string().min(30).max(250).required(),
  image: Joi.string()
});
