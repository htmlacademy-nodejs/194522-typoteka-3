'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (apiRouter, service) => {
  const categoriesRouter = new Router();
  apiRouter.use(`/categories`, categoriesRouter);

  categoriesRouter.get(`/`, (req, res) => {
    return res.status(StatusCode.OK).json(service.findAll());
  });
};
