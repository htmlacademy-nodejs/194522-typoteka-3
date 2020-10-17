'use strict';

const express = require(`express`);
const mainRoutes = require(`./routes/main`);
const articlesRoutes = require(`./routes/articles`);
const categoriesRoutes = require(`./routes/categories`);
const myRoutes = require(`./routes/my`);

const DEFAULT_PORT = 8080;

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);
app.use(`/categories`, categoriesRoutes);

app.listen(DEFAULT_PORT);
