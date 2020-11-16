'use strict';

const fs = require(`fs`).promises;
const FILE_NAME = `mock.json`;
let data = [];

const getMockData = async () => {
  if (data.length) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    console.error(err);
  }

  return data;
};

module.exports = getMockData;
