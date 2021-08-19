'use strict';

const Joi = require(`joi`);

module.exports = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required(),
  announce: Joi.string()
    .min(30)
    .max(250)
    .required(),
  categories: Joi.array()
    .items(Joi.number().integer().positive())
    .min(1)
    .required(),
  text: Joi.string().max(1000),
  title: Joi.string()
    .min(30)
    .max(250)
    .required(),
  image: Joi.string()
});
