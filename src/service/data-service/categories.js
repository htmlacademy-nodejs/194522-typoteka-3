'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return [...new Set(this._articles.map((article) => article.category))];
  }
}

module.exports = CategoriesService;
