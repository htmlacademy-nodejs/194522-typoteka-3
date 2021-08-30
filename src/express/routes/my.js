'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const privateRouteAdmin = require(`../middlewares/private-route-admin`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const {asyncErrorCatcher} = require(`../../utils`);
const {ItemsQuantityPerPage} = require(`../../constants`);
const api = require(`../api`).getAPI();

const csrfProtection = csrf();
const myRouter = new Router();

myRouter.use(privateRouteAdmin);

myRouter.get(`/`, csrfProtection, asyncErrorCatcher(async (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();
  const articles = await api.getArticles();
  return res.render(`my`, {articles, user, csrfToken});
}));

myRouter.get(`/comments`, csrfProtection, asyncErrorCatcher(async (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();
  const comments = await api.getComments({
    isWithArticlesData: true
  });
  return res.render(`comments`, {comments, user, csrfToken});
}));

myRouter.post(`/delete/:articleId`, routeParamsValidator, csrfProtection, asyncErrorCatcher(async (req, res) => {
  await api.deleteArticle(req.params.articleId);
  res.redirect(`/my`);
}));

myRouter.post(`/comments/delete/:commentId`, routeParamsValidator, csrfProtection, asyncErrorCatcher(async (req, res) => {
  await api.deleteComment(req.params.commentId);
  const {socketio} = req.app.locals;
  const [articles, comments] = await Promise.all([
    api.getMostCommentedArticles(ItemsQuantityPerPage.MOST_COMMENTED_ARTICLES),
    api.getComments({limit: ItemsQuantityPerPage.NEWEST_COMMENTS})
  ]);
  socketio.emit(`comment:delete`, {comments, articles});
  res.redirect(`/my/comments`);
}));

module.exports = myRouter;
