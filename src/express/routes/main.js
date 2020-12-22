'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/search-page`, (req, res) => res.render(`search`));

mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const searchResults = await api.search(query);
    return res.render(`search`, {searchResults, isAfterSearch: true});
  } catch (err) {
    return res.render(`search`, {isAfterSearch: true});
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

module.exports = mainRouter;
