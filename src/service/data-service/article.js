'use strict';


const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class ArticleService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._Category = sequelize.models.Category;
  }

  async findAll() {
    const articles = await this._Article.findAll({
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
    });
    return articles;
  }

  async findMostCommented(limit) {
    const articles = await this._Article.findAll({
      limit,
      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "comments"."articleId" = "Article"."id")`
            ),
            `commentsCount`
          ],
        ],
      },
      include: Aliase.COMMENTS,
      order: [Sequelize.literal(`"commentsCount" DESC`)],
      group: [Sequelize.col(`Article.id`)],
      having: Sequelize.where(
          Sequelize.literal(
              `(SELECT COUNT(*) FROM comments WHERE "comments"."articleId" = "Article"."id")`
          ),
          {
            [Op.gte]: 1,
          }
      )
    });
    return articles.map((article) => article.get());
  }

  async findAllByCategory(categoryId) {
    const articles = await this._Article.findAll({
      include: [
        Aliase.COMMENTS,
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          where: {id: categoryId}
        }
      ]
    });
    return articles;
  }

  async findOne(id) {
    const article = await this._Article.findByPk(id, {
      include: [
        Aliase.CATEGORIES,
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          include: {
            model: this._User,
            as: Aliase.USER
          }
        }
      ]
    });
    return article;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article;
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(article, {
      where: {id}
    });
    return !!affectedRows;
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = ArticleService;
