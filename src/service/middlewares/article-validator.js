'use strict';

const {StatusCode} = require(`../../constants`);

const requiredFields = [
  `announce`,
  `categories`,
  `fullText`,
  `title`,
];

const articleValidator = (req, res, next) => {
  const newArticle = req.body;
  const isValid = requiredFields.every((field) => Object.keys(newArticle).includes(field));
  if (!isValid) {
    return res.status(StatusCode.BAD_REQUEST).send(`Bad request`);
  }
  return next();
};

module.exports = articleValidator;
