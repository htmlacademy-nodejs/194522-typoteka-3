'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const {asyncErrorCatcher} = require(`../../utils`);
const articleExist = require(`../middlewares/article-exist`);
const schemaBodyValidator = require(`../middlewares/schema-body-validator`);
const schemaParamsValidator = require(`../middlewares/schema-params-validator`);
const articleSchema = require(`../schemas/article`);
const commentSchema = require(`../schemas/comment`);
const routeParams = require(`../schemas/route-params`);

module.exports = (apiRouter, articleService, commentService) => {
  const articlesRouter = new Router();

  apiRouter.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, asyncErrorCatcher(async (req, res) => {
    const {isMostCommented, isPage, limit, offset} = req.query;
    if (isMostCommented) {
      const articles = await articleService.findMostCommented(limit);
      return res.status(StatusCode.OK).json(articles);
    }
    if (isPage) {
      const pageData = await articleService.findPage({limit, offset});
      return res.status(StatusCode.OK).json(pageData);
    }

    const articles = await articleService.findAll();
    return res.status(StatusCode.OK).json(articles);
  }));

  articlesRouter.get(`/:articleId`, [schemaParamsValidator(routeParams), articleExist(articleService)], (req, res) => {
    const {article} = res.locals;
    return res.status(StatusCode.OK).json(article);
  });

  articlesRouter.get(`/category/:categoryId`, schemaParamsValidator(routeParams), asyncErrorCatcher(async (req, res) => {
    const {limit, offset} = req.query;
    const pageData = await articleService.findPageByCategory({
      categoryId: req.params.categoryId,
      limit,
      offset
    });
    res.status(StatusCode.OK).json(pageData);
  }));

  articlesRouter.post(`/`, schemaBodyValidator(articleSchema), asyncErrorCatcher(async (req, res) => {
    const newPost = await articleService.create(req.body);
    res.status(StatusCode.CREATED).json(newPost);
  }));

  articlesRouter.put(`/:articleId`, [schemaParamsValidator(routeParams), articleExist(articleService), schemaBodyValidator(articleSchema)], asyncErrorCatcher(async (req, res) => {
    const {articleId} = req.params;
    const result = await articleService.update(articleId, req.body);
    return res.status(StatusCode.OK).json(result);
  }));

  articlesRouter.delete(`/:articleId`, [schemaParamsValidator(routeParams), articleExist(articleService)], asyncErrorCatcher(async (req, res) => {
    const {articleId} = req.params;
    const result = await articleService.delete(articleId);
    return res.status(StatusCode.OK).json(result);
  }));

  articlesRouter.get(`/:articleId/comments`, [schemaParamsValidator(routeParams), articleExist(articleService)], asyncErrorCatcher(async (req, res) => {
    const comments = await commentService.findAllByArticleId(req.params.articleId);
    return res.status(StatusCode.OK).json(comments);
  }));

  articlesRouter.post(`/:articleId/comments`, [schemaParamsValidator(routeParams), articleExist(articleService), schemaBodyValidator(commentSchema)], asyncErrorCatcher(async (req, res) => {
    const {article} = res.locals;
    const {text, userId} = req.body;
    const newComment = await commentService.create(article.id, {text, userId});
    return res.status(StatusCode.CREATED).json(newComment);
  }));

  articlesRouter.delete(`/:articleId/comments/:commentId`, [schemaParamsValidator(routeParams), articleExist(articleService)], asyncErrorCatcher(async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.delete(commentId);

    if (!isDeleted) {
      return res.status(StatusCode.NOT_FOUND).send(`Comment ${commentId} not found`);
    }

    return res.status(StatusCode.OK).json(isDeleted);
  }));
};
