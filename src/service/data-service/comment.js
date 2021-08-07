'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
  }

  async findAll({limit = false, isWithArticlesData = false}) {
    const include = [Aliase.USER];
    if (isWithArticlesData) {
      include.push(Aliase.ARTICLE);
    }

    const findParams = limit ? {limit, include} : {include};
    const comments = await this._Comment.findAll(findParams);
    return comments;
  }

  async findAllByArticleId(articleId) {
    const comments = await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
    return comments;
  }

  async create(articleId, comment) {
    const createdComment = await this._Comment.create({
      articleId,
      ...comment,
    });
    return createdComment;
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
