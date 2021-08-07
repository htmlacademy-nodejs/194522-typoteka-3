'use strict';

const {Router} = require(`express`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

const MOST_COMMENTED_ITEMS_QUANTITY = 4;
const COMMENTS_QUANTITY = 4;

mainRouter.get(`/`, async (req, res) => {
  const page = +req.query.page || 1;
  const [
    {count, articles},
    countedCategories,
    mostCommentedArticles,
    comments
  ] = await Promise.all([
    api.getLimitedArticles({
      limit: ARTICLES_PER_PAGE,
      offset: (page - 1) * ARTICLES_PER_PAGE
    }),
    api.getCountedCategories(),
    api.getMostCommentedArticles(MOST_COMMENTED_ITEMS_QUANTITY),
    api.getComments({limit: COMMENTS_QUANTITY})
  ]);

  const totalPagesCount = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {
    articles,
    countedCategories,
    mostCommentedArticles,
    comments,
    totalPagesCount,
    currentPage: page
  });
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

mainRouter.get(`/categories`, async (req, res, next) => {
  try {
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories});
  } catch (err) {
    next(err);
  }
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

module.exports = mainRouter;
