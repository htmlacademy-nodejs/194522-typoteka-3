'use strict';

const express = require(`express`);
const request = require(`supertest`);
const {StatusCode} = require(`../../constants`);
const {SearchService} = require(`../data-service`);
const search = require(`./search`);

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

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API correctly handle search route`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/search`).query({
      query: `достигнуть`
    });
  });

  test(`Returns 200`, () => expect(response.statusCode).toBe(StatusCode.OK));

  test(`Returns correct article`, () => {
    expect(response.body[0].id).toBe(`zhG-y`);
  });

  test(`One article found`, () => expect(response.body.length).toBe(1));
});

test(`API returns code 404 if nothing is found`, () => {
  request(app)
    .get(`/search`)
    .query({
      query: `Asdf`
    })
    .expect(StatusCode.NOT_FOUND);
});

test(`API returns 400 without query string`, () => {
  request(app)
    .get(`/search`)
    .expect(StatusCode.BAD_REQUEST);
});
