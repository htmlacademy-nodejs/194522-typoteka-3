'use strict';

const express = require(`express`);
const {StatusCode, API_PREFIX} = require(`../../constants`);
const api = require(`../api`);
const getMockData = require(`../lib/get-mock-data`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const NOT_FOUND_MESSAGE = `Не найдено`;
const logger = getLogger({name: `api`});

module.exports = {
  name: `--server`,
  async run(args) {
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;
    const app = express();
    const mockData = await getMockData();
    const apiRouter = api(mockData);

    app.use(express.json());

    app.use((req, res, next) => {
      logger.debug(`Request on route ${req.url}`);
      res.on(`finish`, () => {
        logger.info(`Response status code ${res.statusCode}`);
      });
      next();
    });

    app.use(API_PREFIX, apiRouter);

    app.use((req, res) => {
      res.status(StatusCode.NOT_FOUND).send(NOT_FOUND_MESSAGE);
      logger.error(`Route not found: ${req.url}`);
    });

    app.use((err, _req, _res, _next) => {
      logger.error(`An error occured on processing request: ${err.message}`);
    });

    app.listen(port, (err) => {
      if (err) {
        return logger.error(`Ошибка при создании сервера: ${err}`);
      }
      return logger.info(`Сервер запущен на ${port}`);
    });
  }
};
