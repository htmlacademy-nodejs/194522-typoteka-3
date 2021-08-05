'use strict';

const connectDb = require(`../lib/connect-db`);
const initDb = require(`../lib/init-db`);
const sequelize = require(`../lib/sequelize`);
const {generateDbData} = require(`./generate-mock-data`);

const DEFAULT_MOCKS_QUANTITY = 3;

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      await connectDb(sequelize);
      const [mocksQuantity] = args;
      const articlesCount = parseInt(mocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;
      const mockData = await generateDbData(articlesCount);
      await initDb(sequelize, mockData);
    } catch (err) {
      console.err(`Error in filling DB: ${err}`);
    }
  }
};
