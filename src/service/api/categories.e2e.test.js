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

describe(`API works correctly with requesting category by id`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/categories/1`);
  });

  test(`Returns status code ${StatusCode.OK}`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns category with name 'Деревья'`, () => {
    expect(response.body.name).toBe(`Деревья`);
  });
});

describe(`API correctly posts new valid category`, () => {
  let app;
  let response;

  const categoryData = {
    name: `New valid category`
  };

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).post(`/categories`).send(categoryData);
  });

  test(`Returns status code ${StatusCode.CREATED}`, () => {
    expect(response.statusCode).toBe(StatusCode.CREATED);
  });

  test(`Categories quantity increases by 1`, async () => {
    await request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

describe(`API correctly edits category`, () => {
  let app;
  let response;

  const categoryData = {
    name: `New valid category name`
  };

  beforeAll(async () => {
    app = await createApp();
    response = await request(app)
      .put(`/categories/1`)
      .send(categoryData);
  });

  test(`Returns status code ${StatusCode.OK}`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Correctly updates category`, async () => {
    await request(app)
      .get(`/categories/1`)
      .expect((res) => expect(res.body.name).toBe(`New valid category name`));
  });
});

describe(`API correctly deletes category`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app)
      .delete(`/categories/1`);
  });

  test(`Returns status code ${StatusCode.OK}`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Categories quantity decreased by 1`, async () => {
    await request(app)
      .get(`/categories`)
      .expect((res) => expect(res.body.length).toBe(2));
  });
});

test(`Returns status code 400 for requesting non-existing category`, async () => {
  const app = await createApp();
  await request(app).get(`/categories/asdf`).expect(StatusCode.BAD_REQUEST);
});

test(`Returns status code 400 for changing non-existing category`, async () => {
  const app = await createApp();
  await request(app).put(`/categories/asdf`).expect(StatusCode.BAD_REQUEST);
});

test(`Returns status code 400 for deleting non-existing category`, async () => {
  const app = await createApp();
  await request(app).delete(`/categories/asdf`).expect(StatusCode.BAD_REQUEST);
});
