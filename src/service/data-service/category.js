'use strict';

const Sequelize = require(`sequelize`);
const {Op} = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findAll() {
    const categories = await this._Category.findAll({
      order: [[`updatedAt`, `DESC`]]
    });
    return categories;
  }

  async findAllWithCount() {
    const countedCategories = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(
              `COUNT`,
              `*`
          ),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticlesCategories,
        as: Aliase.ARTICLES_CATEGORIES,
        attributes: [],
      }],
      having: Sequelize.where(
          Sequelize.fn(
              `COUNT`,
              Sequelize.col(`CategoryId`)
          ),
          {
            [Op.gte]: 1
          }
      )
    });
    return countedCategories.map((category) => category.get());
  }

  async findOne(id) {
    const category = await this._Category.findByPk(id);
    return category;
  }

  async findByName(name) {
    const category = await this._Category.findOne({
      where: {name}
    });
    return category ? category.get() : null;
  }

  async isArticlesRelatedWithCategory(categoryId) {
    const articles = await this._ArticlesCategories.findAll({
      where: {CategoryId: categoryId}
    });
    return !!articles.length;
  }

  async create(categoryData) {
    const category = await this._Category.create(categoryData);
    return category;
  }

  async update(id, data) {
    const category = await this._Category.update(data, {
      where: {id}
    });
    return category;
  }

  async delete(id) {
    const deletedRows = await this._Category.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CategoryService;
