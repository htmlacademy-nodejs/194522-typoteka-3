'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {StatusCode, API_PREFIX} = require(`../../constants`);
const apiRouter = require(`../api/`);

const DEFAULT_PORT = 3000;
const NOT_FOUND_MESSAGE = `Не найдено`;

module.exports = {
  name: `--server`,
  run(args) {
    const [userPort] = args;
    const port = parseInt(userPort, 10) || DEFAULT_PORT;
    const app = express();

    app.use(express.json());
    app.use(API_PREFIX, apiRouter);

    app.use((req, res) => {
      res.status(StatusCode.NOT_FOUND).send(NOT_FOUND_MESSAGE);
    });

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера: ${err}`));
      }
      return console.info(chalk.green(`Сервер запущен на ${port}`));
    });
  }
};
