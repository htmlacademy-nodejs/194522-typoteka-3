'use strict';

const express = require(`express`);
const path = require(`path`);
const mainRoutes = require(`./routes/main`);
const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);
const myRoutes = require(`./routes/my`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, `templates`));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT);
