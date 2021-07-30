'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {generateData} = require(`./generate-mock-data`);

const FILE_NAME = `mock.json`;
const DEFAULT_MOCKS_QUANTITY = 1;

module.exports = {
  name: `--generate`,
  async run(args) {
    const [userMocksQuantity] = args;
    const articlesCount = parseInt(userMocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;
    try {
      const {articles} = await generateData(articlesCount);
      const content = JSON.stringify(articles);
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(err);
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
