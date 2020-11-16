'use strict';

const {Router} = require(`express`);
const {
  ArticleService,
  CategoriesService,
  CommentService,
  SearchService
} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);
const articlesRouter = require(`./articles`);
const categoriesRouter = require(`./categories`);
const searchRouter = require(`./search`);

const apiRouter = new Router();

(async () => {
  const mockData = await getMockData();
  articlesRouter(apiRouter, new ArticleService(mockData), new CommentService());
  categoriesRouter(apiRouter, new CategoriesService(mockData));
  searchRouter(apiRouter, new SearchService(mockData));
})();

module.exports = apiRouter;
