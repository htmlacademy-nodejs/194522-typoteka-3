'use strict';

const {API_LOG_FILE, ExitCode} = require(`../../constants`);
const {getLogger} = require(`../../utils`);

const logger = getLogger(API_LOG_FILE);

module.exports = async (sequelize) => {
  try {
    logger.info(`Trying to connect to database...`);
    await sequelize.authenticate();
    logger.info(`Database connection has been established successfully.`);
  } catch (err) {
    logger.error(`Unable to connect to database: ${err}`);
    process.exit(ExitCode.ERROR);
  }
};
