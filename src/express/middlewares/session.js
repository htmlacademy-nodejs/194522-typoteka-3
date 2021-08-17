'use strict';

const expressSession = require(`express-session`);
const SequelizeStore = require(`connect-session-sequelize`)(expressSession.Store);
const {Env} = require(`../../constants`);

const SESSION_COOKIE_SAMESITE_MODE = `strict`;
const MILISECONDS_IN_MINUTE = 60000;
const {SESSION_SECRET, NODE_ENV} = process.env;

if (!SESSION_SECRET) {
  throw new Error(`SESSION_SECRET env var is not defined`);
}

module.exports = (sequelize) => {
  return expressSession({
    secret: SESSION_SECRET,
    store: new SequelizeStore({
      db: sequelize,
      expiration: MILISECONDS_IN_MINUTE * 100,
      checkExpirationInterval: MILISECONDS_IN_MINUTE * 1,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: NODE_ENV && NODE_ENV === Env.PRODUCTION,
      sameSite: SESSION_COOKIE_SAMESITE_MODE
    }
  });
};
