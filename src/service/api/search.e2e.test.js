'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);
const {StatusCode} = require(`../../constants`);
const {SearchService} = require(`../data-service`);
const search = require(`./search`);
const fillDbWithData = require(`../lib/fill-db-with-data`);

const mockData = {
  articles: [
    {
      announce: `Достичь успеха помогут ежедневные повторения`,
      text: `Золотое сечение — соотношение двух величин, гармоническая пропорция`,
      title: `Самый лучший музыкальный альбом этого года`,
      image: `skyscraper@2x.jpg`,
      comments: [
        {text: `lorem ipsum`},
        {text: `lorem ipsum lorem`},
      ]
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
    },
    {
      email: `petrov@example.com`,
      passwordHash: `123456`,
      firstName: `Пётр`,
      lastName: `Петров`,
      avatar: `avatar-2.jpg`,
    }
  ]
};

const createAPI = async () => {
  const app = express();
  app.use(express.json());
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await fillDbWithData(mockDb, mockData);
  search(app, new SearchService(mockDb));
  return app;
};

describe(`API correctly handle search route`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app).get(`/search`).query({
      title: `альбом`
    });
  });

  test(`Returns 200`, () => expect(response.statusCode).toBe(StatusCode.OK));

  test(`Returns correct article`, () => {
    expect(response.body[0].id).toBe(1);
  });

  test(`One article found`, () => expect(response.body.length).toBe(1));
});

test(`API returns code 404 if nothing is found`, async () => {
  const app = await createAPI();
  await request(app)
    .get(`/search`)
    .query({
      title: `Asdf`
    })
    .expect(StatusCode.NOT_FOUND);
});

test(`API returns 400 without query string`, async () => {
  const app = await createAPI();
  await request(app)
    .get(`/search`)
    .expect(StatusCode.BAD_REQUEST);
});
