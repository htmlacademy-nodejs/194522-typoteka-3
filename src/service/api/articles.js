'use strict';

const {Router} = require(`express`);
const {StatusCode} = require(`../../constants`);
const articleExist = require(`../middlewares/article-exist`);
const articleValidator = require(`../middlewares/article-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

module.exports = (apiRouter, articleService, commentService) => {
  const articlesRouter = new Router();

  apiRouter.use(`/articles`, articlesRouter);

  articlesRouter.get(`/`, (req, res) => {
    return res.status(StatusCode.OK).json(articleService.findAll());
  });

  articlesRouter.get(`/:articleId`, articleExist(articleService), (req, res) => {
    const {article} = req.locals;
    return res.status(StatusCode.OK).json(article);
  });

  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const newPost = articleService.create(req.body);
    res.status(StatusCode.CREATED).json(newPost);
  });

  articlesRouter.put(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const updatedArticle = articleService.update(articleId, req.body);
    return res.status(StatusCode.OK).json(updatedArticle);
  });

  articlesRouter.delete(`/:articleId`, articleExist(articleService), (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.delete(articleId);
    return res.status(StatusCode.OK).json(deletedArticle);
  });

  articlesRouter.get(`/:articleId/comments`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentService.findAll(article);
    return res.status(StatusCode.OK).json(comments);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, articleExist(articleService), (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const deletedComment = commentService.delete(article, commentId);

    if (!deletedComment) {
      return res.status(StatusCode.NOT_FOUND).send(`Comment ${commentId} not found`);
    }

    return res.status(StatusCode.OK).json(deletedComment);
  });

  articlesRouter.post(`/:articleId/comments`, articleExist(articleService), commentValidator, (req, res) => {
    const {article} = res.locals;
    const newComment = commentService.create(article, req.body);
    return res.status(StatusCode.CREATED).json(newComment);
  });
};
