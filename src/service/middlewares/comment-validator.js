'use strict';

const {StatusCode} = require(`../../constants`);

const requiredFields = [
  `text`,
];

module.exports = (req, res, next) => {
  const isValid = requiredFields.every((field) => Object.keys(req.body).includes(field));
  if (!isValid) {
    return res.status(StatusCode.BAD_REQUEST).send(`Bad request`);
  }
  return next();
};
