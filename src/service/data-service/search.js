'use strict';

const {Op} = require(`sequelize`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    const articles = await this._Article.findAll({
      where: {
        title: {
          [Op.substring]: searchText
        }
      }
    });
    return articles;
  }
}

module.exports = SearchService;
