'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (apiRouter, service) => {
  const searchRouter = new Router();
  apiRouter.use(`/search`, searchRouter);

  searchRouter.get(`/`, async (req, res) => {
    const {title = ``} = req.query;
    if (!title) {
      return res.status(StatusCode.BAD_REQUEST).json([]);
    }

    const searchResult = await service.findAll(title);
    const searchStatus = searchResult.length ? StatusCode.OK : StatusCode.NOT_FOUND;
    return res.status(searchStatus).json(searchResult);
  });
};
