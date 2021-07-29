CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(250) NOT NULL
);

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname varchar(250) NOT NULL,
  lastname varchar(250) NOT NULL,
  email varchar(250) NOT NULL UNIQUE,
  password_hash varchar(250) NOT NULL,
  avatar varchar(250) NOT NULL
);

CREATE TABLE articles(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(250) NOT NULL,
  announce varchar(250) NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  text text,
  image varchar(250),
  user_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE articles_categories(
  articles_id integer NOT NULL,
  categories_id integer NOT NULL,
  FOREIGN KEY (articles_id) REFERENCES articles(id),
  FOREIGN KEY (categories_id) REFERENCES categories(id),
  PRIMARY KEY (articles_id, categories_id)
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  text text NOT NULL,
  createdAt timestamp DEFAULT current_timestamp,
  user_id integer NOT NULL,
  article_id integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE INDEX ON articles(title);
