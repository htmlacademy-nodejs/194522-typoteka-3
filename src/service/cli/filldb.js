'use strict';

const connectDb = require(`../lib/connect-db`);
const fillDbWithData = require(`../lib/fill-db-with-data`);
const getSequelize = require(`../lib/get-sequelize`);
const {generateDbData} = require(`./generate-mock-data`);

const DEFAULT_MOCKS_QUANTITY = 3;

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      const sequelize = getSequelize();
      await connectDb(sequelize);
      const [mocksQuantity] = args;
      const articlesCount = parseInt(mocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;
      const mockData = await generateDbData(articlesCount);
      await fillDbWithData(sequelize, mockData);
    } catch (err) {
      console.err(`Error in filling DB: ${err}`);
    }
  }
};
