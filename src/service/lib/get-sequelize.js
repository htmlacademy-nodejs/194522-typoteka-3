'use strict';

const {Sequelize} = require(`sequelize`);
require(`dotenv`).config();

module.exports = () => {
  const {
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USER
  } = process.env;

  const isMissedEvnVars = [
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USER
  ].some((envVar) => envVar === undefined);

  if (isMissedEvnVars) {
    throw new Error(`One or more env vars are not defined`);
  }

  return new Sequelize({
    dialect: `postgres`,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_NAME,
    username: DB_USER,
    password: DB_PASSWORD,
  });
};
