'use strict';

const ArticleService = require(`./article`);
const CategoryService = require(`./category`);
const CommentService = require(`./comment`);
const SearchService = require(`./search`);
const UserService = require(`./user`);

module.exports = {
  ArticleService,
  CategoryService,
  CommentService,
  SearchService,
  UserService
};
