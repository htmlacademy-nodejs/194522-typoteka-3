'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

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

  categoriesRouter.get(`/:id`, async (req, res) => {
    const category = await service.getOne(req.params.id);
    return res.status(StatusCode.OK).json(category);
  });
};
