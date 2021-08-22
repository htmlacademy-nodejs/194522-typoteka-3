'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const {asyncErrorCatcher} = require(`../../utils`);
const schemaBodyValidator = require(`../middlewares/schema-body-validator`);
const categorySchema = require(`../schemas/category`);
const schemaParamsValidator = require(`../middlewares/schema-params-validator`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParams = require(`../schemas/route-params`);
const isRelatedArticles = require(`../middlewares/is-related-articles`);

module.exports = (apiRouter, categoryService) => {
  const categoriesRouter = new Router();
  apiRouter.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, async (req, res) => {
    const {isWithCount} = req.query;

    const categories = isWithCount ?
      await categoryService.findAllWithCount() :
      await categoryService.findAll();

    return res.status(StatusCode.OK).json(categories);
  });

  categoriesRouter.get(`/:categoryId`, schemaParamsValidator(routeParams), asyncErrorCatcher(async (req, res) => {
    const category = await categoryService.findOne(req.params.categoryId);
    return res.status(StatusCode.OK).json(category);
  }));

  categoriesRouter.post(`/`, schemaBodyValidator(categorySchema), categoryValidator(categoryService), asyncErrorCatcher(async (req, res) => {
    const newCategory = await categoryService.create(req.body);
    return res.status(StatusCode.CREATED).json(newCategory);
  }));

  categoriesRouter.put(`/:categoryId`, schemaParamsValidator(routeParams), categoryValidator(categoryService), asyncErrorCatcher(async (req, res) => {
    const {categoryId} = req.params;
    const updatedCategory = await categoryService.update(categoryId, req.body);
    return res.status(StatusCode.OK).json(updatedCategory);
  }));

  categoriesRouter.delete(`/:categoryId`, schemaParamsValidator(routeParams), isRelatedArticles(categoryService), asyncErrorCatcher(async (req, res) => {
    const {categoryId} = req.params;
    const result = await categoryService.delete(categoryId);
    return res.status(StatusCode.OK).json(result);
  }));
};
