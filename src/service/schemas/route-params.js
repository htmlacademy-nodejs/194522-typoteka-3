'use strict';

const Joi = require(`Joi`);

module.exports = Joi.object({
  articleId: Joi.number().integer().min(1),
  categoryId: Joi.number().integer().min(1),
  commentId: Joi.number().integer().min(1)
});
