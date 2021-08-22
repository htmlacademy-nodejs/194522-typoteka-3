'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const {asyncErrorCatcher} = require(`../../utils`);

module.exports = (apiRouter, service) => {
  const commentsRouter = new Router();
  apiRouter.use(`/comments`, commentsRouter);

  commentsRouter.get(`/`, asyncErrorCatcher(async (req, res) => {
    const {limit, isWithArticlesData} = req.query;
    const comments = await service.findAll({limit, isWithArticlesData});
    return res.status(StatusCode.OK).json(comments);
  }));

  commentsRouter.delete(`/:commentId`, asyncErrorCatcher(async (req, res) => {
    const isDeleted = await service.delete(req.params.commentId);
    const statusCode = isDeleted ? StatusCode.OK : StatusCode.BAD_REQUEST;
    return res.status(statusCode).json(isDeleted);
  }));
};
