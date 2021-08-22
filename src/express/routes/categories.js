'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {decodeURIArray, asyncErrorCatcher} = require(`../../utils`);
const api = require(`../api`).getAPI();
const privateRouteAdmin = require(`../middlewares/private-route-admin`);

const categoriesRouter = new Router();

const csrfProtection = csrf();

categoriesRouter.use(privateRouteAdmin);

categoriesRouter.get(`/`, csrfProtection, asyncErrorCatcher(async (req, res) => {
  const {user} = req.session;
  const csrfToken = req.csrfToken();
  const validationErrors = decodeURIArray(req.query.validationErrors);
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories, user, validationErrors, csrfToken});
}));

categoriesRouter.post(`/`, csrfProtection, async (req, res) => {
  try {
    const data = {
      name: req.body[`add-category`]
    };
    await api.createCategory(data);
    res.redirect(`/categories`);
  } catch (err) {
    res.redirect(`/categories?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

categoriesRouter.post(`/edit/:categoryId`, csrfProtection, async (req, res) => {
  try {
    const {categoryId} = req.params;
    const data = {
      name: req.body[`edit-category`]
    };
    await api.updateCategory(categoryId, data);
    res.redirect(`/categories`);
  } catch (err) {
    res.redirect(`/categories?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

categoriesRouter.post(`/delete/:categoryId`, csrfProtection, async (req, res) => {
  try {
    await api.deleteCategory(req.params.categoryId);
    res.redirect(`/categories`);
  } catch (err) {
    res.redirect(`/categories?validationErrors=${encodeURIComponent(err.response.data)}`);
  }
});

module.exports = categoriesRouter;
