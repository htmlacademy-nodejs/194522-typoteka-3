'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {generateDbData} = require(`./generate-mock-data`);

const DEFAULT_MOCKS_QUANTITY = 1;
const FILL_DB_FILE = `fill-db.sql`;

const joinObjectValuesInInsertString = (obj, keysToInclude = [], numTypeFields) => {
  return keysToInclude.reduce((sum, current, index) => {
    const currentValue = obj[current];
    if (!currentValue) {
      return null;
    }
    const isLastElement = index === keysToInclude.length - 1;
    const isNumType = numTypeFields.includes(current);
    const stringToAdd = isNumType ? sum + currentValue : sum + `'${currentValue}'`;
    return isLastElement ? `${stringToAdd})` : `${stringToAdd}, `;
  }, `(`);
};

const getValuesString = (arr, fields) => arr.map((item) => {
  const numTypes = [`user_id`, `article_id`, `category_id`];
  return joinObjectValuesInInsertString(item, fields, numTypes);
}).join(`,\n`);

const Fields = {
  Article: [`title`, `announce`, `text`, `image`, `user_id`],
  User: [`email`, `password_hash`, `first_name`, `last_name`, `avatar`],
  ArticlesCategories: [`article_id`, `category_id`],
  Comment: [`text`, `user_id`, `article_id`]
};

module.exports = {
  name: `--fill`,
  async run(args) {
    const [userMocksQuantity] = args;
    const articlesCount = parseInt(userMocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;

    try {
      const {
        articles,
        categories,
        users,
      } = await generateDbData(articlesCount);

      const articlesCategories = articles.map((article, i) => ({
        [`article_id`]: i + 1,
        [`category_id`]: article.categories[0]
      }));
      const comments = articles.flatMap((article) => article.comments);
      const categoriesValues = categories.map((category) => `('${category}')`).join(`,\n`);
      const commentsValues = getValuesString(comments, Fields.Comment);
      const usersValues = getValuesString(users, Fields.User);
      const articlesValues = getValuesString(articles, Fields.Article);
      const articlesCategoriesValues = getValuesString(articlesCategories, Fields.ArticlesCategories);

      const fillDbFileContent = `
      INSERT INTO categories(name) VALUES ${categoriesValues};

      INSERT INTO users(${Fields.User.join(`, `)}) VALUES ${usersValues};

      ALTER TABLE articles DISABLE TRIGGER ALL;
      INSERT INTO articles(${Fields.Article.join(`, `)}) VALUES ${articlesValues};
      ALTER TABLE articles ENABLE TRIGGER ALL;

      ALTER TABLE articles_categories DISABLE TRIGGER ALL;
      INSERT INTO articles_categories(${Fields.ArticlesCategories.join(`, `)}) VALUES ${articlesCategoriesValues};
      ALTER TABLE articles_categories ENABLE TRIGGER ALL;

      ALTER TABLE comments DISABLE TRIGGER ALL;
      INSERT INTO COMMENTS(${Fields.Comment.join(`, `)}) VALUES ${commentsValues};
      ALTER TABLE comments ENABLE TRIGGER ALL;`;

      await fs.writeFile(FILL_DB_FILE, fillDbFileContent);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(err));
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
