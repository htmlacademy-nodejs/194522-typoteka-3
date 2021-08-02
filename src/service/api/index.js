'use strict';

const getArticlesRouter = require(`./articles`);
const getCategoriesRouter = require(`./categories`);
const getSearchRouter = require(`./search`);

module.exports = {
  getArticlesRouter,
  getCategoriesRouter,
  getSearchRouter
};
