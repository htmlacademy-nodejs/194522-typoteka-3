'use strict';

const Aliase = require(`../models/aliase`);

class CommentService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
  }

  async findAll({limit = false, isWithArticlesData = false}) {
    const order = [[`createdAt`, `DESC`]];
    const include = [
      {
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (isWithArticlesData) {
      include.push(Aliase.ARTICLE);
    }

    const comments = await this._Comment.findAll({
      include,
      order,
      ...(limit && {limit}),
    });
    return comments;
  }

  async findOne({id, isWithUserData = false}) {
    const include = [];
    if (isWithUserData) {
      include.push({
        model: this._User,
        as: Aliase.USER,
        attributes: {
          exclude: [`passwordHash`]
        }
      });
    }
    const comment = await this._Comment.findByPk(id, {include});
    return comment ? comment.get() : null;
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
    return createdComment ? createdComment.get() : null;
  }

  async delete(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentService;
