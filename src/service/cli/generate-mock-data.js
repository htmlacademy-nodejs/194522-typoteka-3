'use strict';

const {nanoid} = require(`nanoid`);
const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {MAX_ID_LENGTH, ExitCode} = require(`../../constants`);
const {getRandomArrayElements, getRandomInt, getRandomArrayElement} = require(`../../utils`);
const passwordUtils = require(`../lib/password`);

const MILLISECONDS_IN_THREE_MONTH = 7776000000;
const MAX_MOCKS_QUANTITY = 1000;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_TEXTS_PATH = `./data/texts.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DatesLimit = {
  MIN: Date.now() - MILLISECONDS_IN_THREE_MONTH,
  MAX: Date.now(),
};

const FullTextLength = {
  MIN: 1,
  MAX: 5
};

const commentsQuantity = {
  MIN: 1,
  MAX: 3
};

const CommentLength = {
  MIN: 1,
  MAX: 3
};

const mockUsers = [
  {
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`123456`),
    firstName: `Иван`,
    lastName: `Иванов`,
    avatar: `avatar-1.png`,
    isAdmin: true
  },
  {
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`123456`),
    firstName: `Пётр`,
    lastName: `Петров`,
    avatar: `avatar-2.png`,
    isAdmin: false
  }
];

const mockImages = [
  `forest@2x.jpg`,
  `sea@2x.jpg`,
  `skyscraper@2x.jpg`,
];

const readFile = async (path) => {
  try {
    const content = await fs.readFile(path, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (commentsSamples, isAllFields, articleElementIndex) => {
  const commentsCount = getRandomInt(commentsQuantity.MIN, commentsQuantity.MAX);
  return Array(commentsCount).fill({}).map(() => ({
    text: (getRandomArrayElements(getRandomInt(CommentLength.MIN, CommentLength.MAX), commentsSamples)).join(`. `),
    userId: getRandomInt(1, mockUsers.length),
    articleId: articleElementIndex + 1,
    ...(isAllFields && {id: nanoid(MAX_ID_LENGTH)}),
    ...(isAllFields && addDateField()),
  }));
};

const addDateField = () => ({createdAt: (getRandomInt(DatesLimit.MIN, DatesLimit.MAX))});

const generate = async (count, {isAllFields}) => {
  if (count > MAX_MOCKS_QUANTITY) {
    console.error(chalk.red(`${MAX_MOCKS_QUANTITY} max`));
    process.exit(ExitCode.ERROR);
  }

  try {
    const [titles, texts, categories, comments] = await Promise.all([
      readFile(FILE_TITLES_PATH),
      readFile(FILE_TEXTS_PATH),
      readFile(FILE_CATEGORIES_PATH),
      readFile(FILE_COMMENTS_PATH),
    ]);

    const articles = Array(count).fill({}).map((_el, articleElementIndex) => {
      return {
        userId: getRandomInt(1, mockUsers.length),
        announce: getRandomArrayElement(texts),
        categories: [getRandomInt(1, categories.length)],
        text: getRandomArrayElements(getRandomInt(FullTextLength.MIN, FullTextLength.MAX), texts).join(`. `),
        title: getRandomArrayElement(titles),
        image: getRandomArrayElement(mockImages),
        comments: generateComments(comments, isAllFields, articleElementIndex),
        ...(isAllFields && {id: articleElementIndex + 1}),
        ...(isAllFields && addDateField())
      };
    });

    return {
      articles,
      categories,
      users: [...mockUsers]
    };
  } catch (err) {
    return console.error(chalk.red(err));
  }
};

module.exports = {
  generateData: (count) => generate(count, {isAllFields: true}),
  generateDbData: (count) => generate(count, {isAllFields: false})
};
