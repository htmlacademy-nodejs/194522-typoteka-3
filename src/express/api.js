'use strict';

const axios = require(`axios`);

const TIMEOUT = 10000;
const port = process.env.API_PORT || 3000;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles() {
    return this._load(`/articles`);
  }

  getLimitedArticles({limit, offset}) {
    return this._load(`/articles`, {
      params: {
        isPage: true,
        limit,
        offset
      }
    });
  }

  getMostCommentedArticles(limit) {
    return this._load(`/articles`, {
      params: {
        limit,
        isMostCommented: true
      }
    });
  }

  getLimitedArticlesByCategory({categoryId, limit, offset}) {
    return this._load(`/articles/category/${categoryId}`, {
      params: {limit, offset}
    });
  }

  getArticle(id) {
    return this._load(`/articles/${id}`);
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: `POST`,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: `PUT`,
      data
    });
  }

  getCategories() {
    return this._load(`/categories`);
  }

  getCountedCategories() {
    return this._load(`/categories`, {
      params: {
        isWithCount: true
      }
    });
  }

  getCategory(id) {
    return this._load(`/categories/${id}`);
  }

  getComments({limit, isWithArticlesData}) {
    return this._load(`/comments`, {
      params: {limit, isWithArticlesData}
    });
  }

  search(title) {
    return this._load(`/search`, {
      params: {title}
    });
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
