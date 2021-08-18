'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const {asyncErrorCatcher} = require(`../../utils`);
const schemaParamsValidator = require(`../middlewares/schema-params-validator`);
const routeParams = require(`../schemas/route-params`);

module.exports = (apiRouter, service) => {
  const categoriesRouter = new Router();
  apiRouter.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, async (req, res) => {
    const {isWithCount} = req.query;

    const categories = isWithCount ?
      await service.findAllWithCount() :
      await service.findAll();

    return res.status(StatusCode.OK).json(categories);
  });

  categoriesRouter.get(`/:categoryId`, schemaParamsValidator(routeParams), asyncErrorCatcher(async (req, res) => {
    const category = await service.findOne(req.params.categoryId);
    return res.status(StatusCode.OK).json(category);
  }));
};
