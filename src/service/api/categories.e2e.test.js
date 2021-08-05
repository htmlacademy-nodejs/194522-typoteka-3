'use strict';

const request = require(`supertest`);
const express = require(`express`);
const categories = require(`./categories`);
const {CategoryService} = require(`../data-service`);
const {StatusCode} = require(`../../constants`);

const mockData = [
  {
    "id": `zhG-y`,
    "announce": [
      `Вы можете достичь всего. Стоит только немного постараться и запастись книгами`,
      `Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много`,
    ],
    "categories": [`Разное`],
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
    "categories": [`Программирование`],
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
    "categories": [`Кино`],
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

const createAPI = () => {
  const app = express();
  app.use(express.json());
  categories(app, new CategoryService(mockData));
  return app;
};

describe(`API returns categories`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = createAPI();
    response = await request(app).get(`/categories`);
  });

  test(`Returns status code 200`, () => {
    expect(response.statusCode).toBe(StatusCode.OK);
  });

  test(`Returns 3 categories`, () => {
    expect(response.body.length).toBe(3);
  });

  test(`Categories names are "Разное, Программирование, Кино"`, () => {
    expect(response.body).toEqual(expect.arrayContaining([`Разное`, `Программирование`, `Кино`]));
  });
});
