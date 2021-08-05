-- Получить список всех категорий (идентификатор, наименование категории);
SELECT * FROM categories;

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT id, name
FROM categories
RIGHT JOIN articles_categories ON categories.id = articles_categories.categoryId

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT categories.id, categories.name, count(articles_categories.articleId)
FROM categories
LEFT JOIN articles_categories ON categories.id = articles_categories.categoryId
GROUP BY categories.id

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.createdAt,
  users.firstName,
  users.lastName,
  users.email,
  count(DISTINCT comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM articles
LEFT JOIN users ON articles.userId = users.id
LEFT JOIN comments ON articles.id = comments.articleId
LEFT JOIN articles_categories ON articles_categories.articleId = articles.id
LEFT JOIN categories ON articles_categories.categoryId = categories.id
GROUP BY articles.id, users.id, categories.id
ORDER BY articles.createdAt DESC

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.text,
  articles.createdAt,
  articles.image,
  users.firstName,
  users.lastName,
  users.email,
  count(DISTINCT comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM articles
LEFT JOIN users ON users.id = articles.userId
LEFT JOIN comments ON comments.articleId = articles.id
LEFT JOIN articles_categories ON articles_categories.articleId = articles.id
LEFT JOIN categories ON categories.id = articles_categories.categoryId
WHERE articles.id = 1
GROUP BY articles.id, users.id, categories.id

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.articleId,
  users.firstName,
  users.lastName,
  comments.text
FROM comments
LEFT JOIN users ON users.id = comments.userId
LIMIT 5

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id,
  comments.articleId,
  users.firstName,
  users.lastName,
  comments.text
FROM comments
LEFT JOIN users ON users.id = comments.userId
WHERE comments.articleId = 1
ORDER BY comments.createdAt DESC

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
