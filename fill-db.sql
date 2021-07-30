INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

INSERT INTO users (first_name, last_name, email, password_hash, avatar) VALUES
('Ivanov', 'Ivan', 'ivanov@ivan.com', '123456', 'avatar-1.jpg'),
('Petrov', 'Petr', 'petrov@petr.com', '123456', 'avatar-2.jpg');

ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles (title, announce, text, image, user_id) VALUES
('Обзор новейшего смартфона', 'Первая большая ёлка была установлена только в 1938 году', 'Собрать камни бесконечности легко, если вы прирожденный герой', 'forest@2x.jpg', 1),
('Что такое золотое сечение', 'Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете', 'Он написал больше 30 хитов', 'skyscraper@2x.jpg', 1),
('Самый лучший музыкальный альбом этого года', 'Простые ежедневные упражнения помогут достичь успеха', 'Как начать действовать? Для начала просто соберитесь', 'sea@2x.jpg', 2);
ALTER TABLE articles ENABLE TRIGGER ALL;

ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories (article_id, category_id) VALUES
(1, 1),
(2, 3),
(3, 5);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments (text, user_id, article_id) VALUES
('Согласен с автором!', 1, 1),
('Мне кажется или я уже читал это где-то?', 1, 1),
('Хочу такую же футболку :-)', 1, 2),
('Планируете записать видосик на эту тему?', 2, 2);
ALTER TABLE comments ENABLE TRIGGER ALL;
