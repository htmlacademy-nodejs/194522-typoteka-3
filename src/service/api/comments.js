'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);

module.exports = (apiRouter, service) => {
  const commentsRouter = new Router();
  apiRouter.use(`/comments`, commentsRouter);

  commentsRouter.get(`/`, async (req, res) => {
    const {limit, isWithArticlesData} = req.query;
    const comments = await service.findAll({limit, isWithArticlesData});
    return res.status(StatusCode.OK).json(comments);
  });
};
