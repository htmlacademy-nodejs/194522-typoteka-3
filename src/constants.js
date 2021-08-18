'use strict';

module.exports = {
  DEFAULT_COMMAND: `--help`,
  USER_ARGV_INDEX: 2,
  MAX_ID_LENGTH: 5,
  API_PREFIX: `/api`,
  ARTICLES_PER_PAGE: 8,
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
  }
};
