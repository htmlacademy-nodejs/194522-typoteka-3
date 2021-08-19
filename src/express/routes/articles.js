'use strict';

const {Router} = require(`express`);
const {createStorage, ensureArray, decodeURIArray} = require(`../../utils`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {ARTICLES_PER_PAGE} = require(`../../constants`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const privateRouteAdmin = require(`../middlewares/private-route-admin`);
const privateRoute = require(`../middlewares/private-route`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

articlesRouter.get(`/add`, privateRouteAdmin, async (req, res) => {
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const categories = await api.getCategories();
  res.render(`new-post`, {categories, validationErrors, user});
});

articlesRouter.get(`/edit/:articleId`, privateRouteAdmin, routeParamsValidator, async (req, res, next) => {
  const {articleId} = req.params;
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(articleId),
      api.getCategories()
    ]);
    res.render(`edit-post`, {article, categories, validationErrors, user});
  } catch (err) {
    next(err);
  }
});

articlesRouter.get(`/category/:categoryId`, routeParamsValidator, async (req, res) => {
  const {categoryId} = req.params;
  const page = +req.query.page || 1;
  const {user} = req.session;
  const [
    {count, articles},
    countedCategories,
    category
  ] = await Promise.all([
    api.getLimitedArticlesByCategory({
      categoryId,
      limit: ARTICLES_PER_PAGE,
      offset: (page - 1) * ARTICLES_PER_PAGE
    }),
    api.getCountedCategories(),
    api.getCategory(categoryId)
  ]);

  const totalPagesCount = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`articles-by-category`, {
    articles,
    countedCategories,
    categoryName: category.name,
    selectedCategoryId: category.id,
    currentPage: page,
    totalPagesCount,
    user
  });
});

articlesRouter.get(`/:articleId`, routeParamsValidator, async (req, res) => {
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const article = await api.getArticle(req.params.articleId);
  res.render(`post`, {article, validationErrors, user});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    categories: ensureArray(body.categories),
    title: body[`title`],
    announce: body[`announcement`],
    text: body[`full-text`],
    image: file ? file.filename : undefined,
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`/articles/add?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.post(`/edit/:articleId`, routeParamsValidator, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {articleId} = req.params;

  const articleData = {
    categories: ensureArray(body.categories),
    title: body[`title`],
    announce: body[`announcement`],
    text: body[`full-text`],
    image: file ? file.filename : body[`photo`],
  };

  try {
    await api.editArticle(articleId, articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`/articles/edit/${articleId}?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

articlesRouter.post(`/:articleId/comments`, privateRoute, routeParamsValidator, async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;
  const {text} = req.body;
  try {
    await api.createComment(articleId, {text, userId: user.id});
    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    res.redirect(`/articles/${articleId}?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

module.exports = articlesRouter;
