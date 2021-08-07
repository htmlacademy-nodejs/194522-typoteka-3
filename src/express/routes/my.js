'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  return res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getComments({
    isWithArticlesData: true
  });
  return res.render(`comments`, {comments});
});

module.exports = myRouter;
