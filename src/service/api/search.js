'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (apiRoter, service) => {
  const searchRouter = new Router();
  apiRoter.use(`/search`, searchRouter);

  searchRouter.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    if (!query) {
      return res.status(StatusCode.BAD_REQUEST).json([]);
    }

    const searchResult = service.findAll(query);
    const searchStatus = searchResult.length ? StatusCode.OK : StatusCode.NOT_FOUND;
    return res.status(searchStatus).json(searchResult);
  });
};
