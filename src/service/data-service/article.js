'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticleService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  create(article) {
    const newPost = Object.assign(article, {
      id: nanoid(MAX_ID_LENGTH),
      comments: []
    });
    this._articles.push(newPost);
    return newPost;
  }

  update(id, updatedData) {
    const articleToUpdate = this._articles.find((article) => article.id === id);
    return Object.assign(articleToUpdate, updatedData);
  }

  delete(id) {
    const articleToDelete = this._articles.find((article) => article.id === id);
    if (!articleToDelete) {
      return null;
    }

    this._articles = this._articles.filter((article) => article.id !== id);
    return articleToDelete;
  }
}

module.exports = ArticleService;
