'use strict';

const {ItemsQuantityPerPage} = require(`../../constants`);

module.exports = (articleService, commentService) => async (req, res, next) => {
  try {
    const {socketio} = req.app.locals;
    const {comment} = res.locals;
    const articles = await articleService.findMostCommented(ItemsQuantityPerPage.MOST_COMMENTED_ARTICLES);
    const commentWithUserData = await commentService.findOneWithUserData(comment.id);
    socketio.emit(`comment:create`, {comment: commentWithUserData, articles});
    return next();
  } catch (err) {
    return next(err);
  }
};
