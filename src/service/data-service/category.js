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
    const categories = await this._Category.findAll();
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
}

module.exports = CategoryService;
