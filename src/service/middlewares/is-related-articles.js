'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const isRelatedArticles = await categoryService.isArticlesRelatedWithCategory(req.params.categoryId);
  if (isRelatedArticles) {
    return res.status(StatusCode.BAD_REQUEST).send(`Can't delete category assosiated with existing article`);
  }

  return next();
};
