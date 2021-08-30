'use strict';

const express = require(`express`);
const {
  StatusCode,
  API_PREFIX,
  API_LOG_FILE,
  DefaultPort
} = require(`../../constants`);
const api = require(`../api`);
const connectDb = require(`../lib/connect-db`);
const getSequelize = require(`../lib/get-sequelize`);
const defineModels = require(`../lib/define-models`);
const {getLogger} = require(`../../utils`);

const NOT_FOUND_MESSAGE = `Not found`;
const defaultPort = process.env.API_PORT || DefaultPort.API;
const logger = getLogger(API_LOG_FILE);

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
    const port = parseInt(userParamPort, 10) || defaultPort;
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
