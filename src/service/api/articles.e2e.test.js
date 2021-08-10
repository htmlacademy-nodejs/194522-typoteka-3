'use strict';

const request = require(`supertest`);
const express = require(`express`);
const Sequelize = require(`sequelize`);
const {StatusCode} = require(`../../constants`);
const articles = require(`./articles`);
const {ArticleService, CommentService} = require(`../data-service`);
const fillDbWithData = require(`../lib/fill-db-with-data`);


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
      avatar: `avatar-1.jpg`
    },
    {
      email: `petrov@example.com`,
      passwordHash: `123456`,
      firstName: `Пётр`,
      lastName: `Петров`,
      avatar: `avatar-2.jpg`
    }
  ]
};

const createApp = async () => {
  const app = express();
  app.use(express.json());
  const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});
  await fillDbWithData(mockDb, mockData);
  articles(app, new ArticleService(mockDb), new CommentService(mockDb));
  return app;
};

describe(`API returns articles`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/articles`);
  });

  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns 2 articles`, () => {
    expect(response.body.length).toBe(2);
  });

  test(`First article id is 1`, () => {
    expect(response.body[0].id).toBe(1);
  });
});

describe(`API works correctly with requesting article by id`, () => {
  let response;
  let app;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/articles/1`);
  });

  test(`Returns status 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns article with title 'Самый лучший музыкальный альбом этого года'`, () => {
    expect(response.body.title).toBe(`Самый лучший музыкальный альбом этого года`);
  });
});

test(`Returns 400 for requesting non-existing article`, async () => {
  const app = await createApp();
  const response = await request(app).get(`/articles/non-existing-id`);
  expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
});

describe(`API works correctly with posting valid article`, () => {
  let app;
  let response;

  const newArticle = {
    announce: `test announce test announce test announce test announce`,
    categories: [1],
    text: `full mock text`,
    title: `test title test title test title test title`,
  };

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Returns 201 status code`, () => {
    expect(response.statusCode).toBe(StatusCode.CREATED);
  });

  test(`Articles quantity increases by 1`, async () => {
    await request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(3));
  });
});

describe(`API refuses to create new article if data is invalid`, () => {
  const invalidDataArticle = {
    title: `test title`
  };

  test(`Returns 500`, async () => {
    const app = await createApp();
    const response = await request(app).post(`/articles`).send(invalidDataArticle);
    expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
  });
});

describe(`API changes existing article`, () => {
  let response;
  let app;

  const updatedArticle = {
    announce: `test announce test announce test announce test announce`,
    categories: [1],
    text: `full mock text`,
    title: `new test title new test title new test title new test title`,
  };

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).put(`/articles/1`).send(updatedArticle);
  });

  test(`Returns status 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Item is changed`, () => request(app)
    .get(`/articles/1`)
    .expect((res) => expect(res.body.title).toBe(`new test title new test title new test title new test title`))
  );
});

test(`Returns 400 for trying to change non-existent article`, async () => {
  const app = await createApp();
  const newArticle = {
    announce: `test announce`,
    categories: [2],
    text: `full mock text`,
    title: `test title`,
  };
  await request(app)
    .put(`/articles/asdf`)
    .send(newArticle)
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly delete article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).delete(`/articles/1`);
  });

  test(`Returns status 200`, () => expect(response.statusCode).toBe(StatusCode.OK));

  test(`Article count decreased by 1`, async () => await request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent article`, async () => {
  const app = await createApp();
  await request(app)
    .delete(`/article/asdf`)
    .expect(StatusCode.NOT_FOUND);
});

describe(`API returns comments for requested article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app).get(`/articles/1/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns list of 1 comment`, () => expect(response.body.length).toBe(1));
  test(`Comment's text is "Согласен с автором!"`, () => expect(response.body[0].text).toBe(`Согласен с автором!`));
});

describe(`API creates a comment if data is valid`, () => {
  let app;
  let response;

  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  beforeAll(async () => {
    app = await createApp();
    response = await request(app)
      .post(`/articles/1/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
  test(`Returns created comment`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 400`, async () => {
  const app = await createApp();
  await request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `test`
    })
    .expect(StatusCode.BAD_REQUEST);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, async () => {
  const app = await createApp();
  await request(app)
    .post(`/articles/1/comments`)
    .send({})
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createApp();
    response = await request(app)
      .delete(`/articles/1/comments/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Comments count decreased by 1`, () => request(app)
    .get(`/articles/1/comments`)
    .expect((res) => expect(res.body.length).toBe(0))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createApp();
  await request(app)
    .delete(`/articles/1/comments/NOEXST`)
    .expect(StatusCode.BAD_REQUEST);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createApp();
  await request(app)
    .delete(`/articles/NOEXST/comments/1`)
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API works correctly with invalid data`, () => {
  let app;

  const newArticle = {
    announce: `test announce`,
    categories: [1],
    text: `full mock text`,
    title: `test title`,
  };

  beforeAll(async () => {
    app = await createApp();
  });

  test(`When field type is wrong response code is 400`, async () => {
    const invalidArticles = [
      {...newArticle, announce: true},
      {...newArticle, image: 1},
      {...newArticle, title: false},
      {...newArticle, categories: `asdf`},
    ];
    for (const invalidArticle of invalidArticles) {
      await request(app)
        .post(`/articles`)
        .send(invalidArticle)
        .expect(StatusCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const invalidArticles = [
      {...newArticle, announce: `too short`},
      {...newArticle, title: `too short`},
      {...newArticle, categories: []}
    ];
    for (const invalidArticle of invalidArticles) {
      await request(app)
        .post(`/articles`)
        .send(invalidArticle)
        .expect(StatusCode.BAD_REQUEST);
    }
  });
});
