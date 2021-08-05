'use strict';

const {Router} = require(`express`);
const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);
const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
} = require(`../data-service`);

module.exports = (data) => {
  const apiRouter = new Router();
  getCategoriesRouter(apiRouter, new CategoryService(data));
  getArticlesRouter(apiRouter, new ArticleService(data), new CommentService());
  getSearchRouter(apiRouter, new SearchService(data));
  return apiRouter;
};
