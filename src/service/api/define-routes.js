'use strict';

const {Router} = require(`express`);
const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);
const getCommentsRouter = require(`./comments`);
const getUserRouter = require(`./user`);
const {
  CategoryService,
  ArticleService,
  CommentService,
  SearchService,
  UserService,
} = require(`../data-service`);

module.exports = (sequelize) => {
  const apiRouter = new Router();
  getCategoriesRouter(apiRouter, new CategoryService(sequelize));
  getArticlesRouter(apiRouter, new ArticleService(sequelize), new CommentService(sequelize));
  getSearchRouter(apiRouter, new SearchService(sequelize));
  getCommentsRouter(apiRouter, new CommentService(sequelize));
  getUserRouter(apiRouter, new UserService(sequelize));
  return apiRouter;
};
