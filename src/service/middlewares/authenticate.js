'use strict';

const {StatusCode} = require(`../../constants`);
const passwordUtil = require(`../lib/password`);

module.exports = async (req, res, next) => {
  const {user} = res.locals;
  const isAuthenticated = await passwordUtil.compare(req.body.password, user.passwordHash);
  if (!isAuthenticated) {
    return res.status(StatusCode.UNAUTHORIZED).send(`Wrong login data`);
  }

  return next();
};
