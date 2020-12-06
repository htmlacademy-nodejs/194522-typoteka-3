'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`, async (req, res) => {
  const {body} = req;
  const data = {
    announce: body.announce,
    category: body.category,
    fullText: body.fullText,
    title: body.title,
  };
  try {
    await api.postArticle(data);
    res.redirect(`/my`);
  } catch (err) {
    console.error(err);
    res.redirect(`back`);
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories()
  ]);
  res.render(`edit-post`, {article, categories});
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/:id`, (req, res) => res.render(`post`));

module.exports = articlesRouter;
