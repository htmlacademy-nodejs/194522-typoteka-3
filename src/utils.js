'use strict';

const multer = require(`multer`);

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

module.exports = {
  getRandomInt,
  getRandomArrayElement,
  getRandomArrayElements,
  createStorage,
  ensureArray,
  decodeURIArray,
};
