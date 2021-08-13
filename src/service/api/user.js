'use strict';

const Router = require(`express`);
const {StatusCode} = require(`../../constants`);
const schemaBodyValidator = require(`../middlewares/schema-body-validator`);
const userSchema = require(`../schemas/user`);
const emailValidator = require(`../middlewares/email-validator`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, userService) => {
  const userRouter = new Router();

  app.use(`/user`, userRouter);

  userRouter.post(`/`, schemaBodyValidator(userSchema), emailValidator(userService), async (req, res) => {
    const {
      email,
      password,
      firstName,
      lastName,
      avatar,
      isAdmin,
    } = req.body;

    const passwordHash = await passwordUtils.hash(password);
    const userData = {
      email,
      passwordHash,
      firstName,
      lastName,
      avatar,
      isAdmin,
    };
    const newUser = await userService.createUser(userData);
    delete newUser.passwordHash;
    res.status(StatusCode.CREATED).json(newUser);
  });
};
