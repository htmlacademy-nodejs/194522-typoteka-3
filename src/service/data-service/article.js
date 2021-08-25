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
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findAll() {
    const articles = await this._Article.findAll({
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      order: [[`createdAt`, `DESC`]],
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

  async findPageByCategory({limit, offset, categoryId}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [
        Aliase.COMMENTS,
        Aliase.CATEGORIES,
        {
          model: this._ArticlesCategories,
          as: Aliase.ARTICLES_CATEGORIES,
          attributes: [],
          where: {
            CategoryId: categoryId
          },
        },
      ],
      distinct: true
    });
    return {count, articles: rows};
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
            as: Aliase.USER,
            attributes: {
              exclude: [`passwordHash`],
            }
          },
          separate: true,
          order: [
            [`createdAt`, `DESC`]
          ]
        }
      ]
    });
    return article;
  }

  async findPage({limit, offset}) {
    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include: [Aliase.CATEGORIES, Aliase.COMMENTS],
      distinct: true,
      order: [[`createdAt`, `DESC`]],
    });
    return {count, articles: rows};
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article;
  }

  async update(id, article) {
    await this._Article.update(article, {where: {id}});
    const categoriesIds = article.categories.map((categoryId) => +categoryId);
    const updatedArticle = await this.findOne(id);
    await updatedArticle.setCategories(categoriesIds);
    return updatedArticle.get();
  }

  async delete(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = ArticleService;
