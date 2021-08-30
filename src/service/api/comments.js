'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const routeParamsValidator = require(`../../express/middlewares/route-params-validator`);
const {asyncErrorCatcher} = require(`../../utils`);

module.exports = (apiRouter, commentService) => {
  const commentsRouter = new Router();
  apiRouter.use(`/comments`, commentsRouter);

  commentsRouter.get(`/`, asyncErrorCatcher(async (req, res) => {
    const {limit, isWithArticlesData} = req.query;
    const comments = await commentService.findAll({limit, isWithArticlesData});
    return res.status(StatusCode.OK).json(comments);
  }));

  commentsRouter.get(`/:commentId`, routeParamsValidator, async (req, res) => {
    const id = req.params.commentId;
    const {isWithUserData} = req.query;
    const comment = await commentService.findOne({id, isWithUserData});
    return res.status(StatusCode.OK).json(comment);
  });

  commentsRouter.delete(`/:commentId`, routeParamsValidator, asyncErrorCatcher(async (req, res) => {
    const isDeleted = await commentService.delete(req.params.commentId);
    const statusCode = isDeleted ? StatusCode.OK : StatusCode.BAD_REQUEST;
    return res.status(statusCode).json(isDeleted);
  }));
};
