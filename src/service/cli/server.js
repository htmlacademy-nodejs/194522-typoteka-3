'use strict';

const express = require(`express`);
const {StatusCode, API_PREFIX} = require(`../../constants`);
const api = require(`../api`);
const connectDb = require(`../lib/connect-db`);
const getSequelize = require(`../lib/get-sequelize`);
const {getLogger} = require(`../lib/logger`);
const defineModels = require(`../lib/define-models`);

const DEFAULT_PORT = 3000;
const NOT_FOUND_MESSAGE = `Не найдено`;
const logger = getLogger({name: `api`});

const initDb = async (sequelize) => {
  await connectDb(sequelize);
  defineModels(sequelize);
};

module.exports = {
  name: `--server`,
  async run(args) {
    const sequelize = getSequelize();
    await initDb(sequelize);

    const [userParamPort] = args;
    const port = parseInt(userParamPort, 10) || DEFAULT_PORT;
    const app = express();
    const apiRouter = api(sequelize);

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

    app.use((err, _req, res, _next) => {
      logger.error(`An error occured on processing request: ${err.message}`);
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err.message);
    });

    app.listen(port, (err) => {
      if (err) {
        return logger.error(`Unable to connect to the server: ${err}`);
      }
      return logger.info(`Server is running on port ${port}`);
    });
  }
};
