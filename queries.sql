-- Получить список всех категорий (идентификатор, наименование категории);
SELECT * FROM categories;

-- Получить список категорий для которых создана минимум одна публикация (идентификатор, наименование категории);
SELECT id, name
FROM categories
RIGHT JOIN articles_categories ON categories.id = articles_categories.category_id

-- Получить список категорий с количеством публикаций (идентификатор, наименование категории, количество публикаций в категории);
SELECT categories.id, categories.name, count(articles_categories.article_id)
FROM categories
JOIN articles_categories ON categories.id = articles_categories.category_id
GROUP BY categories.id

-- Получить список публикаций (идентификатор публикации, заголовок публикации, анонс публикации, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие публикации;
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.created_at,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM articles
LEFT JOIN users ON articles.user_id = users.id
LEFT JOIN comments ON articles.id = comments.article_id
LEFT JOIN articles_categories ON articles_categories.article_id = articles.id
LEFT JOIN categories ON articles_categories.category_id = categories.id
GROUP BY articles.id, users.id, categories.id
ORDER BY articles.created_at DESC

-- Получить полную информацию определённой публикации (идентификатор публикации, заголовок публикации, анонс, полный текст публикации, дата публикации, путь к изображению, имя и фамилия автора, контактный email, количество комментариев, наименование категорий);
SELECT
  articles.id,
  articles.title,
  articles.announce,
  articles.text,
  articles.created_at,
  articles.image,
  users.first_name,
  users.last_name,
  users.email,
  count(comments.id),
  STRING_AGG(DISTINCT categories.name, ', ')
FROM articles
LEFT JOIN users ON users.id = articles.user_id
LEFT JOIN comments ON comments.article_id = articles.id
LEFT JOIN articles_categories ON articles_categories.article_id = articles.id
LEFT JOIN categories ON categories.id = articles_categories.category_id
WHERE articles.id = 1
GROUP BY articles.id, users.id, categories.id

-- Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария);
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
LEFT JOIN users ON users.id = comments.user_id
LIMIT 5

-- Получить список комментариев для определённой публикации (идентификатор комментария, идентификатор публикации, имя и фамилия автора, текст комментария). Сначала новые комментарии;
SELECT
  comments.id,
  comments.article_id,
  users.first_name,
  users.last_name,
  comments.text
FROM comments
LEFT JOIN users ON users.id = comments.user_id
WHERE comments.article_id = 1
ORDER BY comments.created_at DESC

-- Обновить заголовок определённой публикации на «Как я встретил Новый год»;
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE articles.id = 1;
