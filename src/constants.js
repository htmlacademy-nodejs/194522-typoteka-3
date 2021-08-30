'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  API_PREFIX: `/api`,
  API_LOG_FILE: `./logs/api.log`,
  ItemsQuantityPerPage: {
    COMMON_ARTICLES: 8,
    MOST_COMMENTED_ARTICLES: 4,
    NEWEST_COMMENTS: 4,
  },
  DefaultPort: {
    API: 3000,
    FRONT: 8080
  },
  ExitCode: {
    ERROR: 1,
    SUCCESS: 0,
  },
  StatusCode: {
    OK: 200,
    CREATED: 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
  },
  Env: {
    DEVELOPMENT: `development`,
    PRODUCTION: `production`
  },
  HttpMethod: {
    GET: `GET`,
    POST: `POST`,
    PUT: `PUT`,
    DELETE: `DELETE`
  }
};
