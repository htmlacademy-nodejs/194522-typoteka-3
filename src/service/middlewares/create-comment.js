'use strict';

module.exports = (commentService) => async (req, res, next) => {
  try {
    const {article} = res.locals;
    const {text, userId} = req.body;
    const comment = await commentService.create(article.id, {text, userId});
    res.locals.comment = comment;
    return next();
  } catch (err) {
    return next(err);
  }
};
