'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const articleExist = require(`../middlewares/article-exist`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (apiRouter, articleService, commentService) => {
  const articlesRouter = new Router();

  apiRouter.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, async (req, res) => {
    const {isMostCommented, limit} = req.query;

    if (isMostCommented) {
      const articles = await articleService.findMostCommented(limit);
      return res.status(StatusCode.OK).json(articles);
    }

    const articles = await articleService.findAll();
    return res.status(StatusCode.OK).json(articles);
  });

  articlesRouter.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    return res.status(StatusCode.OK).json(article);
  });

  articlesRouter.get(`/category/:categoryId`, async (req, res) => {
    const articles = await articleService.findAllByCategory(req.params.categoryId);
    res.status(StatusCode.OK).json(articles);
  });

  articlesRouter.post(`/`, articleValidator, async (req, res) => {
    const newPost = await articleService.create(req.body);
    res.status(StatusCode.CREATED).json(newPost);
  });

  articlesRouter.put(`/:articleId`, [articleExist(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const result = await articleService.update(articleId, req.body);
    return res.status(StatusCode.OK).json(result);
  });

  articlesRouter.delete(`/:articleId`, articleExist(articleService), async (req, res) => {
    const {articleId} = req.params;
    const result = await articleService.delete(articleId);
    return res.status(StatusCode.OK).json(result);
  });

  articlesRouter.get(`/:articleId/comments`, articleExist(articleService), async (req, res) => {
    const comments = await commentService.findAllByArticleId(req.params.articleId);
    return res.status(StatusCode.OK).json(comments);
  });

  articlesRouter.post(`/:articleId/comments`, articleExist(articleService), commentValidator, async (req, res) => {
    const {article} = res.locals;
    const newComment = await commentService.create(article.id, req.body);
    return res.status(StatusCode.CREATED).json(newComment);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExist(articleService), async (req, res) => {
    const {commentId} = req.params;
    const isDeleted = await commentService.delete(commentId);

    if (!isDeleted) {
      return res.status(StatusCode.NOT_FOUND).send(`Comment ${commentId} not found`);
    }

    return res.status(StatusCode.OK).json(isDeleted);
  });
};
