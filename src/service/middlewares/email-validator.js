'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (userService) => async (req, res, next) => {
  const {email} = req.body;
  const existingUser = await userService.findByEmail(email);
  if (existingUser) {
    return res.status(StatusCode.BAD_REQUEST).send(`Email ${email} is already in use`);
  }

  return next();
};
