'use strict';

const {StatusCode} = require(`../../constants`);

module.exports = (userService) => async (req, res, next) => {
  try {
    const user = await userService.findByEmail(req.body.email);
    if (!user) {
      return res.status(StatusCode.BAD_REQUEST).send(`Wrong login data`);
    }
    res.locals.user = user;
    return next();
  } catch (err) {
    return next();
  }
};
