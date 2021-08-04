'use strict';

const logger = require(`./logger`).getLogger();

module.exports = async (sequelize) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Database connection has been established successfully.`);
  } catch (err) {
    logger.error(`Unable to connect to database: ${err}`);
    process.exit(1);
  }
};
