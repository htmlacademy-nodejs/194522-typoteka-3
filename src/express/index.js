'use strict';

const express = require(`express`);
const path = require(`path`);
const mainRoutes = require(`./routes/main`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);
const session = require(`./middlewares/session`);
const categoriesRoutes = require(`./routes/categories`);
const {getLogger} = require(`../utils`);
const sequelize = require(`../service/lib/get-sequelize`)();

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;
const UPLOAD_DIR = `upload`;
const LOG_FILE = `./logs/express.log`;
const EXPRESS_LOGGER_NAME = `express-app-logger`;

const app = express();
const logger = getLogger(LOG_FILE, {name: EXPRESS_LOGGER_NAME});

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(express.urlencoded({extended: false}));

app.use(session(sequelize));

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);

app.use((req, res) => {
  res.render(`errors/404`);
});

app.use((err, req, res, _next) => {
  logger.error(`An error occured on processing request: ${err.message}`);
  res.status(500).render(`errors/500`);
});

sequelize.sync({force: false});

app.listen(DEFAULT_PORT, (err) => {
  if (err) {
    return logger.error(`Unable to connect to the server: ${err}`);
  }
  return logger.info(`Express app is running on ${DEFAULT_PORT}`);
});
