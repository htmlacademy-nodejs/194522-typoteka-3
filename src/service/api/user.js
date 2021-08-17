'use strict';

const Router = require(`express`);
const {StatusCode} = require(`../../constants`);
const schemaBodyValidator = require(`../middlewares/schema-body-validator`);
const userSchema = require(`../schemas/user`);
const loginDataSchema = require(`../schemas/login-data`);
const emailValidator = require(`../middlewares/email-validator`);
const passwordUtils = require(`../lib/password`);
const authenticate = require(`../middlewares/authenticate`);
const userExist = require(`../middlewares/user-exist`);

module.exports = (app, userService) => {
  const userRouter = new Router();

  app.use(`/user`, userRouter);

  userRouter.post(`/`, [schemaBodyValidator(userSchema), emailValidator(userService)], async (req, res) => {
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

  userRouter.post(`/login`, [
    schemaBodyValidator(loginDataSchema),
    userExist(userService),
    authenticate
  ], (req, res) => {
    const {user} = res.locals;
    delete user.passwordHash;
    return res.status(StatusCode.OK).json(user);
  });
};
