'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (schema) => (req, res, next) => {
  const {error} = schema.validate(req.params);
  if (error) {
    const errorsMessages = error.details.map((err) => err.message).join(`\n`);
    return res.status(StatusCode.BAD_REQUEST).json(errorsMessages);
  }
  return next();
};
