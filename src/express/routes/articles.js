'use strict';

const {Router} = require(`express`);
const {createStorage, ensureArray} = require(`../../utils`);
const {nanoid} = require(`nanoid`);
const path = require(`path`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

const UPLOAD_DIR = `../upload/img/`;
const UNIQUE_NAME_LENGTH = 10;
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const upload = createStorage(uploadDirAbsolute, nanoid(UNIQUE_NAME_LENGTH));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.get(`/edit/:id`, async (req, res, next) => {
  const {id} = req.params;
  try {
    const [article, categories] = await Promise.all([
      api.getArticle(id),
      api.getCategories()
    ]);
    res.render(`edit-post`, {article, categories});
  } catch (err) {
    next(err);
  }
});

articlesRouter.get(`/category/:id`, async (req, res) => {
  const categoryId = req.params.id;
  const [
    articles,
    countedCategories,
    category
  ] = await Promise.all([
    api.getArticlesByCategory(categoryId),
    api.getCountedCategories(),
    api.getCategory(categoryId)
  ]);
  res.render(`articles-by-category`, {
    articles,
    countedCategories,
    categoryName: category.name,
    selectedCategoryId: category.id
  });
});

articlesRouter.get(`/:id`, async (req, res) => {
  const article = await api.getArticle(req.params.id);
  res.render(`post`, {article});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res, next) => {
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
    res.redirect(`back`);
    next(err);
  }
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res, next) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    categories: ensureArray(body.categories),
    title: body[`title`],
    announce: body[`announcement`],
    text: body[`full-text`],
    image: file ? file.filename : body[`photo`],
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
    next(err);
  }
});

module.exports = articlesRouter;
