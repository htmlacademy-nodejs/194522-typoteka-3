'use strict';

const {Router} = require(`express`);
const {
  ArticlesService,
  CategoriesService,
  CommentsService,
  SearchService
} = require(`../data-service`);
const getMockData = require(`../lib/get-mock-data`);
const articlesRouter = require(`./articles`);
const categoriesRouter = require(`./categories`);
const searchRouter = require(`./search`);

const apiRouter = new Router();

(async () => {
  const mockData = await getMockData();
  articlesRouter(apiRouter, new ArticlesService(mockData), new CommentsService());
  categoriesRouter(apiRouter, new CategoriesService(mockData));
  searchRouter(apiRouter, new SearchService(mockData));
})();

module.exports = apiRouter;
