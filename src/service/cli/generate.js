'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {
  getRandomInt,
  getRandomArrayElement,
  getRandomArrayElements,
} = require(`../../utils`);
const ExitCode = require(`../../constants`);

const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_TEXTS_PATH = `./data/texts.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_NAME = `mock.json`;
const DEFAULT_COUNT = 1;
const MILLISECONDS_IN_THREE_MONTH = 7776000000;
const MAX_MOCK_ITEMS = 1000;

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

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (count, titles, texts, categories) => {
  return Array(count).fill({}).map(() => ({
    announce: getRandomArrayElements(getRandomInt(AnnounceLength.min, AnnounceLength.max), texts),
    category: getRandomArrayElement(categories),
    createdDate: getRandomInt(DatesLimit.min, DatesLimit.max),
    fullText: getRandomArrayElements(getRandomInt(FullTextLength.min, FullTextLength.max), texts),
    title: getRandomArrayElement(titles),
  }));
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const [itemsCount] = args;
    const articlesCount = parseInt(itemsCount, 10) || DEFAULT_COUNT;
    if (itemsCount > MAX_MOCK_ITEMS) {
      console.info(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.error);
    }
    try {
      const generateArticlesParams = await Promise.all([
        readFile(FILE_TITLES_PATH),
        readFile(FILE_TEXTS_PATH),
        readFile(FILE_CATEGORIES_PATH),
      ]);
      const content = JSON.stringify(generateArticles(articlesCount, ...generateArticlesParams));
      fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
