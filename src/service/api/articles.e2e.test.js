'use strict';

const request = require(`supertest`);
const express = require(`express`);
const {StatusCode} = require(`../../constants`);
const articles = require(`./articles`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);

const mockData = [
  {
    "id": `zhG-y`,
    "announce": [
      `Вы можете достичь всего. Стоит только немного постараться и запастись книгами`,
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много`,
    ],
    "category": `Разное`,
    "createdDate": 1603419401917,
    "fullText": [
      `Это один из лучших рок-музыкантов`,
      `Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами`,
      `Как начать действовать? Для начала просто соберитесь`
    ],
    "title": `Как достигнуть успеха не вставая с кресла`,
    "comments": [
      {
        "id": `ORk_E`,
        "text": `Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `5tzUN`,
        "text": `Совсем немного.... Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "id": `LFrXN`,
    "announce": [
      `Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете`,
    ],
    "category": `Программирование`,
    "createdDate": 1598777410275,
    "fullText": [
      `Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле`
    ],
    "title": `Самый лучший музыкальный альбом этого года`,
    "comments": [
      {
        "id": `I4aP9`,
        "text": `Плюсую, но слишком много буквы!. Согласен с автором!. Планируете записать видосик на эту тему?`
      }
    ]
  },
  {
    "id": `6cqDJ`,
    "announce": [
      `Это один из лучших рок-музыкантов`
    ],
    "category": `Кино`,
    "createdDate": 1598355262354,
    "fullText": [
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много`,
      `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`
    ],
    "title": `Ёлки. История деревьев`,
    "comments": [
      {
        "id": `m_iKk`,
        "text": `Совсем немного...`
      },
      {
        "id": `_Q2od`,
        "text": `Согласен с автором!. Мне кажется или я уже читал это где-то?`
      },
      {
        "id": `5nGKE`,
        "text": `Согласен с автором!. Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.`
      }
    ]
  }
];

const createApp = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticleService(cloneData), new CommentService(cloneData));
  return app;
};

describe(`API returns articles`, () => {
  let response;
  beforeAll(async () => {
    response = await request(createApp()).get(`/articles`);
  });

  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns 3 articles`, () => {
    expect(response.body.length).toBe(3);
  });

  test(`First article id is 'zhG-y'`, () => {
    expect(response.body[0].id).toBe(`zhG-y`);
  });
});

describe(`API works correctly with requesting article by id`, () => {
  let response;
  beforeAll(async () => {
    response = await request(createApp()).get(`/articles/zhG-y`);
  });

  test(`Returns status 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns article with title 'Как достигнуть успеха не вставая с кресла'`, () => {
    expect(response.body.title).toBe(`Как достигнуть успеха не вставая с кресла`);
  });
});

test(`Returns 404 for non-existing article`, async () => {
  const response = await request(createApp()).get(`/articles/asdf`, () => {
    expect(response.statusCode).toBe(StatusCode.NOT_FOUND);
  });
});

describe(`API works correctly with posting valid article`, () => {
  const app = createApp();
  let response;
  const newArticle = {
    announce: `test announce`,
    category: `test category`,
    fullText: `full mock text`,
    title: `test title`,
  };

  beforeAll(async () => {
    response = await request(app).post(`/articles`).send(newArticle);
  });

  test(`Returns 201 status code`, () => {
    expect(response.statusCode).toBe(StatusCode.CREATED);
  });

  test(`Returns created new article`, () => {
    expect(response.body).toEqual(expect.objectContaining(newArticle));
  });

  test(`Articles quantity increases by 1`, () => {
    request(app).get(`/articles`).expect((res) => expect(res.body.length).toBe(4));
  });
});

describe(`API refuses to create new article if data is invalid`, () => {
  const invalidDataArticle = {
    title: `test title`
  };

  test(`Returns 500`, async () => {
    const response = await request(createApp()).post(`/articles`).send(invalidDataArticle);
    expect(response.statusCode).toBe(StatusCode.BAD_REQUEST);
  });
});

describe(`API changes existing article`, () => {
  let response;
  const updatedData = {
    title: `new test title`,
    category: `updated category`
  };

  beforeAll(async () => {
    response = await request(createApp()).put(`/articles/zhG-y`).send(updatedData);
  });

  test(`Returns status 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns updated article`, () => {
    expect(response.body).toEqual(expect.objectContaining(updatedData));
  });

  test(`Article category and title are changed`, () => {
    expect(response.body.title).toBe(`new test title`);
    expect(response.body.category).toBe(`updated category`);
  });
});

test(`Returns 404 for trying to change non-existent article`, () => {
  const newArticle = {
    announce: `test announce`,
    category: `test category`,
    fullText: `full mock text`,
    title: `test title`,
  };

  return request(createApp())
    .put(`/articles/asdf`)
    .send(newArticle)
    .expect(StatusCode.NOT_FOUND);
});

describe(`API correctly delete article`, () => {
  const app = createApp();
  let response;

  beforeAll(async () => {
    response = await request(app).delete(`/articles/zhG-y`);
  });

  test(`Returns status 200`, () => expect(response.statusCode).toBe(StatusCode.OK));

  test(`Returns deleted article`, () => expect(response.body.id).toBe(`zhG-y`));

  test(`Article count decreased by 1`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(2))
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createApp();
  return request(app)
    .delete(`/article/asdf`)
    .expect(StatusCode.NOT_FOUND);
});

describe(`API returns comments for requested article`, () => {
  const app = createApp();
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/articles/zhG-y/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is "ORk_E"`, () => expect(response.body[0].id).toBe(`ORk_E`));
});

describe(`API creates a comment if data is valid`, () => {
  const app = createApp();
  const newComment = {
    text: `Валидному комментарию достаточно этого поля`
  };

  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles/zhG-y/comments`)
      .send(newComment);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(StatusCode.CREATED));
  test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
  test(`Comments count is changed`, () => request(app)
    .get(`/articles/zhG-y/comments`)
    .expect((res) => expect(res.body.length).toBe(3))
  );
});

test(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
  const app = createApp();
  return request(app)
    .post(`/articles/NOEXST/comments`)
    .send({
      text: `test`
    })
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
  const app = createApp();
  return request(app)
    .post(`/articles/zhG-y/comments`)
    .send({})
    .expect(StatusCode.BAD_REQUEST);
});

describe(`API correctly deletes a comment`, () => {
  const app = createApp();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/zhG-y/comments/ORk_E`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(StatusCode.OK));
  test(`Returns comment deleted`, () => expect(response.body.id).toBe(`ORk_E`));
  test(`Comments count decreased by 1`, () => request(app)
    .get(`/articles/zhG-y/comments`)
    .expect((res) => expect(res.body.length).toBe(1))
  );
});

test(`API refuses to delete non-existent comment`, () => {
  const app = createApp();
  return request(app)
    .delete(`/articles/zhG-y/comments/NOEXST`)
    .expect(StatusCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent offer`, () => {
  const app = createApp();
  return request(app)
    .delete(`/offers/NOEXST/comments/ORk_E`)
    .expect(StatusCode.NOT_FOUND);
});
