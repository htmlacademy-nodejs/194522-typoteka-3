'use strict';

const request = require(`supertest`);
const express = require(`express`);
const categories = require(`./categories`);
const {CategoryService} = require(`../data-service`);
const {StatusCode} = require(`../../constants`);
const {Sequelize} = require(`sequelize`);
const fillDbWithData = require(`../lib/fill-db-with-data`);

const mockData = {
  articles: [
    {
      announce: `Достичь успеха помогут ежедневные повторения`,
      text: `Золотое сечение — соотношение двух величин, гармоническая пропорция`,
      title: `Самый лучший музыкальный альбом этого года`,
      image: `skyscraper@2x.jpg`,
    }
  ],
  categories: [
    `Деревья`,
    `Музыка`,
    `Кино`
  ],
  users: [
    {
      email: `ivanov@example.com`,
      passwordHash: `123456`,
      firstName: `Иван`,
      lastName: `Иванов`,
      avatar: `avatar-1.jpg`,
      isAdmin: true
    },
    {
      email: `petrov@example.com`,
      passwordHash: `123456`,
      firstName: `Пётр`,
      lastName: `Петров`,
      avatar: `avatar-2.jpg`,
      isAdmin: false
    }
  ]
};

const createApp = async () => {
  const app = express();
  app.use(express.json());
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await fillDbWithData(mockDb, mockData);
  categories(app, new CategoryService(mockDb));
  return app;
};

describe(`API returns categories`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/categories`);
  });

  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns 3 categories`, () => {
    expect(response.body.length).toBe(3);
  });

  test(`Categories names are "Деревья, Музыка, Кино"`, () => {
    expect(response.body.map((category) => category.name)).toEqual(expect.arrayContaining([`Деревья`, `Музыка`, `Кино`]));
  });
});

test(`Returns status code 400 for invalid route params`, async () => {
  const app = await createApp();
  await request(app).get(`/categories/asdf`).expect(StatusCode.BAD_REQUEST);
});
