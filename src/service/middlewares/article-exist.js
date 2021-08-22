'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  try {
    const article = await service.findOne(articleId);
    if (!article) {
      return res.status(StatusCode.NOT_FOUND).send(`Not found`);
    }
    res.locals.article = article;
    return next();
  } catch (err) {
    return next(err);
  }
};
