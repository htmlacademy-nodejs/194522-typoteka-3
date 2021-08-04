'use strict';

const {Router} = require(`express`);
const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);
const {
  CategoriesService,
  ArticlesService,
  CommentsService,
  SearchService,
} = require(`../data-service`);

module.exports = (data) => {
  const apiRouter = new Router();
  getCategoriesRouter(apiRouter, new CategoriesService(data));
  getArticlesRouter(apiRouter, new ArticlesService(data), new CommentsService());
  getSearchRouter(apiRouter, new SearchService(data));
  return apiRouter;
};
