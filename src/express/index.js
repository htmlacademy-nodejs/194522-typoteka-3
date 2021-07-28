'use strict';

const express = require(`express`);
const path = require(`path`);
const mainRoutes = require(`./routes/main`);
const articlesRoutes = require(`./routes/articles`);
const myRoutes = require(`./routes/my`);

const DEFAULT_PORT = 8080;
const PUBLIC_DIR = `public`;
const TEMPLATES_DIR = `templates`;
const UPLOAD_DIR = `upload`;

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.resolve(__dirname, TEMPLATES_DIR));

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.static(path.resolve(__dirname, UPLOAD_DIR)));

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/articles`, articlesRoutes);

app.use((req, res) => {
  res.render(`errors/404`);
});

app.use((err, req, res, _next) => {
  res.status(500).render(`errors/500`);
});


app.listen(DEFAULT_PORT);
