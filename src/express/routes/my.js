'use strict';

const {Router} = require(`express`);
const privateRouteAdmin = require(`../middlewares/private-route-admin`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.use(privateRouteAdmin);

myRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles();
  return res.render(`my`, {articles, user});
});

myRouter.get(`/comments`, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getComments({
    isWithArticlesData: true
  });
  return res.render(`comments`, {comments, user});
});

module.exports = myRouter;
