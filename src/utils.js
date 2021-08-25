'use strict';

const multer = require(`multer`);
const pino = require(`pino`);

const getRandomInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomArrayElements = (quantity, initArray) => {
  const array = [];
  for (let i = 0; i < quantity; i++) {
    array.push(getRandomArrayElement(initArray));
  }

  return array;
};

const createStorage = (uploadDir, uniqueName) => {
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const extension = file.originalname.split(`.`).pop();
      cb(null, `${uniqueName}.${extension}`);
    }
  });
  return multer({storage});
};

const ensureArray = (value) => {
  if (value) {
    return Array.isArray(value) ? value : [value];
  }

  return [];
};

const decodeURIArray = (string) => string ? string.split(`,`) : [];

const asyncErrorCatcher = (asyncMiddleware) => async (req, res, next) => {
  try {
    await asyncMiddleware(req, res);
  } catch (err) {
    next(err);
  }
};

const getLogger = (logFile, options = {}) => {
  const {Env} = require(`./constants`);
  const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
  const defaultLoggingLevel = isDevMode ? `info` : `error`;
  const logger = pino(
      {
        name: `pino-base-logger`,
        level: process.env.LOG_LEVEL || defaultLoggingLevel,
        prettyPrint: isDevMode
      },
      isDevMode ? process.stdout : pino.destination(logFile)
  );
  return logger.child(options);
};

module.exports = {
  getRandomInt,
  getRandomArrayElement,
  getRandomArrayElements,
  createStorage,
  ensureArray,
  decodeURIArray,
  asyncErrorCatcher,
  getLogger,
};
