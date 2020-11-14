'use strict';

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  getRandomArrayElement,
  getRandomArrayElements,
} = require(`../../utils`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);

const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_TEXTS_PATH = `./data/texts.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_NAME = `mock.json`;
const DEFAULT_MOCKS_QUANTITY = 1;
const MILLISECONDS_IN_THREE_MONTH = 7776000000;
const MAX_MOCKS_QUANTITY = 1000;

const DatesLimit = {
  min: Date.now() - MILLISECONDS_IN_THREE_MONTH,
  max: Date.now(),
};

const AnnounceLength = {
  min: 1,
  max: 5
};

const FullTextLength = {
  min: 1,
  max: 5
};

const commentsQuantity = {
  min: 1,
  max: 3
};

const CommentLength = {
  min: 1,
  max: 3
};

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (quantity, titles, texts, categories, comments) => {
  return Array(quantity).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    announce: getRandomArrayElements(getRandomInt(AnnounceLength.min, AnnounceLength.max), texts),
    category: getRandomArrayElement(categories),
    createdDate: getRandomInt(DatesLimit.min, DatesLimit.max),
    fullText: getRandomArrayElements(getRandomInt(FullTextLength.min, FullTextLength.max), texts),
    title: getRandomArrayElement(titles),
    comments: Array(getRandomInt(commentsQuantity.min, commentsQuantity.max)).fill({}).map(() => ({
      id: nanoid(MAX_ID_LENGTH),
      text: getRandomArrayElements(getRandomInt(CommentLength.min, CommentLength.max), comments)
    }))
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [userMocksQuantity] = args;
    const articlesCount = parseInt(userMocksQuantity, 10) || DEFAULT_MOCKS_QUANTITY;
    if (userMocksQuantity > MAX_MOCKS_QUANTITY) {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }
    try {
      const generateArticlesParams = await Promise.all([
        readFile(FILE_TITLES_PATH),
        readFile(FILE_TEXTS_PATH),
        readFile(FILE_CATEGORIES_PATH),
        readFile(FILE_COMMENTS_PATH),
      ]);
      const content = JSON.stringify(generateArticles(articlesCount, ...generateArticlesParams));
      fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
