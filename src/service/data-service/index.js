'use strict';

const ArticlesService = require(`./articles`);
const CategoriesService = require(`./categories`);
const CommentsService = require(`./comments`);
const SearchService = require(`./search`);

module.exports = {
  ArticlesService,
  CategoriesService,
  CommentsService,
  SearchService
};
