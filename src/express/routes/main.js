'use strict';

const {Router} = require(`express`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const {decodeURIArray, createStorage} = require(`../../utils`);
const privateRouteAdmin = require(`../middlewares/private-route-admin`);
const api = require(`../api`).getAPI();

const mainRouter = new Router();

const MOST_COMMENTED_ITEMS_QUANTITY = 4;
const COMMENTS_QUANTITY = 4;
const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

mainRouter.get(`/`, async (req, res) => {
  const page = +req.query.page || 1;
  const {user} = req.session;
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
    user,
    currentPage: page
  });
});

mainRouter.get(`/search`, async (req, res) => {
  const {title} = req.query;
  const {user} = req.session;
  try {
    const searchResults = await api.search(title);
    return res.render(`search`, {searchingTitle: title, searchResults, user});
  } catch (err) {
    return res.render(`search`, {searchingTitle: title, searchResults: [], user});
  }
});

mainRouter.get(`/categories`, privateRouteAdmin, async (req, res, next) => {
  const {user} = req.session;
  try {
    const categories = await api.getCategories();
    res.render(`all-categories`, {categories, user});
  } catch (err) {
    next(err);
  }
});

mainRouter.get(`/register`, (req, res) => {
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  res.render(`sign-up`, {validationErrors, user});
});

mainRouter.get(`/login`, (req, res) => {
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  res.render(`login`, {validationErrors, user});
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/login`);
});

mainRouter.post(`/login`, async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await api.loginUser({email, password});
    req.session.user = user;
    res.redirect(`/`);
  } catch (err) {
    res.redirect(`/login?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

mainRouter.post(`/register`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    firstName: body.name,
    lastName: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file ? file.filename : undefined,
    isAdmin: false
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (err) {
    res.redirect(`/register?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

module.exports = mainRouter;
