'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const createUserRouter = require(`./user`);
const {UserService} = require(`../data-service`);
const fillDbWithData = require(`../lib/fill-db-with-data`);
const {StatusCode} = require(`../../constants`);

const mockData = {
  articles: [
    {
      announce: `Достичь успеха помогут ежедневные повторения`,
      text: `Золотое сечение — соотношение двух величин, гармоническая пропорция`,
      title: `Самый лучший музыкальный альбом этого года`,
      image: `skyscraper@2x.jpg`,
      comments: [{text: `Согласен с автором!`}],
    },
    {
      announce: `Процессор заслуживает особого внимания.`,
      text: `Возьмите книгу новую книгу и закрепите все упражнения на практике`,
      title: `Обзор новейшего смартфона`,
      image: `skyscraper@2x.jpg`,
      comments: [{text: `Мне кажется или я уже читал это где-то?`}],
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
  createUserRouter(app, new UserService(mockDb));
  return app;
};

describe(`API creates new user if data is valid`, () => {
  const validUserData = {
    firstName: `Name`,
    lastName: `Surname`,
    email: `asdf@asdf.com`,
    password: `123456`,
    passwordRepeated: `123456`,
    avatar: `avatar-1.jpg`,
    isAdmin: false
  };

  test(`Returns status code ${StatusCode.CREATED}`, async () => {
    const app = await createApp();
    const response = await request(app).post(`/user`).send(validUserData);
    expect(response.statusCode).toBe(StatusCode.CREATED);
  });
});

describe(`API refuses to create new user if data is invalid`, () => {
  let app;

  const validUserData = {
    firstName: `Name`,
    lastName: `Surname`,
    email: `asdf@asdf.com`,
    password: `123456`,
    passwordRepeated: `123456`,
    avatar: `avatar-1.jpg`,
    isAdmin: false
  };

  beforeAll(async () => {
    app = await createApp();
  });

  test(`Without any required fields returns ${StatusCode.BAD_REQUEST}`, async () => {
    for (const key of Object.keys(validUserData)) {
      const NON_REQUIRED_FIELD = `avatar`;
      const userData = {...validUserData};
      if (key !== NON_REQUIRED_FIELD) {
        delete userData[key];
        await request(app)
          .post(`/user`)
          .send(userData)
          .expect(StatusCode.BAD_REQUEST);
      }
    }
  });

  test(`For data with wrong field type returns ${StatusCode.BAD_REQUEST}`, async () => {
    const badUserDataList = [
      {...validUserData, firstName: 1},
      {...validUserData, lastName: 1},
      {...validUserData, email: 1},
      {...validUserData, password: 1},
      {...validUserData, passwordRepeated: 1},
      {...validUserData, avatar: 1},
      {...validUserData, isAdmin: 1},
    ];

    for (const badUserData of badUserDataList) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`For data with invalid value returns ${StatusCode.BAD_REQUEST}`, async () => {
    const badUserDataList = [
      {...validUserData, password: `short`},
      {...validUserData, email: `invalid email`},
    ];
    for (const badUserData of badUserDataList) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal returns ${StatusCode.BAD_REQUEST}`, async () => {
    const notEqualPasswordsData = {...validUserData, passwordRepeated: `not the same`};
    await request(app)
      .post(`/user`)
      .send(notEqualPasswordsData)
      .expect(StatusCode.BAD_REQUEST);
  });

  test(`When email is already in use returns ${StatusCode.BAD_REQUEST}`, async () => {
    const userWithBusyEmail = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(userWithBusyEmail)
      .expect(StatusCode.BAD_REQUEST);
  });
});
