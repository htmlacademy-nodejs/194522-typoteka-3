'use strict';

const {ExitCode} = require(`../../constants`);
const Aliase = require(`../models/aliase`);
const defineModels = require(`./define-models`);
const logger = require(`./logger`).getLogger();

module.exports = async (sequelize, data) => {
  const {articles, categories, users} = data;

  try {
    logger.info(`Trying to fill database...`);
    const {Article, Category, User} = defineModels(sequelize);
    await sequelize.sync({force: true});

    const userPromises = users.map(async (user) => {
      await User.create(user, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});
    });

    const articlesPromises = articles.map(async (article) => {
      const articleModel = await Article.create(article, {include: Aliase.COMMENTS});
      await articleModel.addCategories(article.categories);
    });

    await Category.bulkCreate(categories.map((category) => ({name: category})));
    await Promise.all(userPromises);
    await Promise.all(articlesPromises);

    logger.info(`DB was successfully filled with mock data.`);
  } catch (err) {
    logger.error(`An error occured on filling database: ${err.message}`);
    process.exit(ExitCode.ERROR);
  }
};
