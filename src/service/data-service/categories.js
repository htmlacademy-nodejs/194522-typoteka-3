'use strict';

class CategoriesService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    const categories = this._articles.reduce((acc, article) => {
      acc.add(...article.categories);
      return acc;
    }, new Set());

    return [...categories];
  }
}

module.exports = CategoriesService;
