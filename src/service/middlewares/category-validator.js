'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (categoryService) => async (req, res, next) => {
  const {name} = req.body;
  const existingCategory = await categoryService.findByName(name);
  if (existingCategory) {
    return res.status(StatusCode.BAD_REQUEST).send(`Category '${name}' is already exists`);
  }

  return next();
};
