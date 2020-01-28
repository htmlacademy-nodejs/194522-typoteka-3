'use strict';

const getRandomInt = (min, max) => Math.floor(min + Math.random() * (max - min + 1));

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const getRandomArrayElements = (quantity, initArray) => {
  const array = [];
  for (let i = 0; i < quantity; i++) {
    array.push(getRandomArrayElement(initArray));
  }

  return array;
};

module.exports = {
  getRandomInt,
  getRandomArrayElement,
  getRandomArrayElements,
};
