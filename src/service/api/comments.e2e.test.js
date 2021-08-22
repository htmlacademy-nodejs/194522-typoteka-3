'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const fillDbWithData = require(`../lib/fill-db-with-data`);
const {StatusCode} = require(`../../constants`);
const defineCommentsRouter = require(`./comments`);
const {CommentService} = require(`../data-service`);

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

const createApp = async () => {
  const app = express();
  app.use(express.json());
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await fillDbWithData(mockDb, mockData);
  defineCommentsRouter(app, new CommentService(mockDb));
  return app;
};

describe(`Returns comments`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/comments`);
  });

  test(`returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`returns 2 comments`, () => {
    expect(response.body.length).toBe(2);
  });
});

describe(`Correctly deletes existing comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).delete(`/comments/1`);
  });

  test(`Returns status code ${StatusCode.OK}`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Comments count decreased by 1`, () => request(app)
    .get(`/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createApp();
  await request(app)
    .delete(`/comments/NOEXST`)
    .expect(StatusCode.BAD_REQUEST);
});
