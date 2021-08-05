CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(250) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstName varchar(250) NOT NULL,
  lastName varchar(250) NOT NULL,
  email varchar(250) NOT NULL UNIQUE,
  passwordHash varchar(250) NOT NULL,
  avatar varchar(250) NOT NULL
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(250) NOT NULL,
  announce varchar(250) NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  text text NOT NULL,
  image varchar(250),
  userId integer NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE articles_categories(
  articleId integer NOT NULL,
  categoryId integer NOT NULL,
  FOREIGN KEY (articleId) REFERENCES articles(id),
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  PRIMARY KEY (articleId, categoryId)
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  userId integer NOT NULL,
  articleId integer NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (articleId) REFERENCES articles(id)
);

CREATE INDEX ON articles(title);
