'use strict';

const axios = require(`axios`);
const {HttpMethod, DefaultPort} = require(`../constants`);

const TIMEOUT = 10000;
const port = process.env.API_PORT || DefaultPort.API;
const defaultURL = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
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
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteArticle(id) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.DELETE
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

  createCategory(data) {
    return this._load(`/categories`, {
      method: HttpMethod.POST,
      data
    });
  }

  updateCategory(id, data) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  deleteCategory(id) {
    return this._load(`/categories/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  getComments({limit, isWithArticlesData}) {
    return this._load(`/comments`, {
      params: {limit, isWithArticlesData}
    });
  }

  getCommentWithUserData(id) {
    return this._load(`/comments/${id}`, {
      params: {
        isWithUserData: true
      }
    });
  }

  createComment(articleId, data) {
    return this._load(`/articles/${articleId}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  deleteComment(id) {
    return this._load(`/comments/${id}`, {
      method: HttpMethod.DELETE
    });
  }

  search(title) {
    return this._load(`/search`, {
      params: {title}
    });
  }

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  loginUser(data) {
    return this._load(`/user/login`, {
      method: HttpMethod.POST,
      data
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }
}

const defaultAPI = new API(defaultURL, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
