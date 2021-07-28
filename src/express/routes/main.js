'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/search`, async (req, res) => {
  const {title} = req.query;
  try {
    const searchResults = await api.search(title);
    return res.render(`search`, {searchingTitle: title, searchResults});
  } catch (err) {
    return res.render(`search`, {searchingTitle: title, searchResults: []});
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
