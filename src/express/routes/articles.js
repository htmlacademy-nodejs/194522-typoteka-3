'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {
  createStorage,
  ensureArray,
  decodeURIArray,
  asyncErrorCatcher} = require(`../../utils`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const {ItemsQuantityPerPage} = require(`../../constants`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const privateRouteAdmin = require(`../middlewares/private-route-admin`);
const privateRoute = require(`../middlewares/private-route`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;

const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);
const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));
const csrfProtection = csrf();

articlesRouter.get(`/add`, csrfProtection, privateRouteAdmin, asyncErrorCatcher(async (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const categories = await api.getCategories();
  res.render(`new-post`, {categories, validationErrors, user, csrfToken});
}));

articlesRouter.get(`/edit/:articleId`, csrfProtection, privateRouteAdmin, routeParamsValidator, asyncErrorCatcher(async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const csrfToken = req.csrfToken();
  const [article, categories] = await Promise.all([
    api.getArticle(articleId),
    api.getCategories()
  ]);
  res.render(`edit-post`, {article, categories, validationErrors, user, csrfToken});
}));

articlesRouter.get(`/category/:categoryId`, routeParamsValidator, asyncErrorCatcher(async (req, res) => {
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
      limit: ItemsQuantityPerPage.COMMON_ARTICLES,
      offset: (page - 1) * ItemsQuantityPerPage.COMMON_ARTICLES
    }),
    api.getCountedCategories(),
    api.getCategory(categoryId)
  ]);

  const totalPagesCount = Math.ceil(count / ItemsQuantityPerPage.COMMON_ARTICLES);

  res.render(`articles-by-category`, {
    articles,
    countedCategories,
    categoryName: category.name,
    selectedCategoryId: category.id,
    currentPage: page,
    totalPagesCount,
    user
  });
}));

articlesRouter.get(`/:articleId`, csrfProtection, routeParamsValidator, asyncErrorCatcher(async (req, res) => {
  const {user} = req.session;
  const {referer} = req.headers;
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const article = await api.getArticle(req.params.articleId);
  const csrfToken = req.csrfToken();
  res.render(`post`, {article, validationErrors, user, csrfToken, referer});
}));

articlesRouter.post(`/add`, privateRouteAdmin, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
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

articlesRouter.post(`/edit/:articleId`, privateRouteAdmin, routeParamsValidator, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {articleId} = req.params;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
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

articlesRouter.post(`/:articleId/comments`, privateRoute, routeParamsValidator, csrfProtection, async (req, res) => {
  const {articleId} = req.params;
  const {user} = req.session;
  const {text} = req.body;
  try {
    const comment = await api.createComment(articleId, {text, userId: user.id});
    const {socketio} = req.app.locals;
    const [articles, commentWithUserData] = await Promise.all([
      api.getMostCommentedArticles(ItemsQuantityPerPage.MOST_COMMENTED_ARTICLES),
      api.getCommentWithUserData(comment.id)
    ]);
    socketio.emit(`comment:create`, {comment: commentWithUserData, articles});
    res.redirect(`/articles/${articleId}`);
  } catch (err) {
    res.redirect(`/articles/${articleId}?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

module.exports = articlesRouter;
