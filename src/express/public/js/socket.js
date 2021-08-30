'use strict';

const NEWEST_COMMENTS_QUANTITY = 4;

const socket = io(document.location.origin);
const commentsContainerElement = document.querySelector('.main-page__last');
const commentsListElement = commentsContainerElement.querySelector('ul');

const cutString = (string) => {
  const MAX_LENGTH = 100;
  return string.length > MAX_LENGTH ? `${string.slice(0, MAX_LENGTH)}...` : string;
};

const createCommentElement = (comment) => {
  const {articleId, text, user} = comment;
  const commentElement = document.createElement(`li`);
  const imageElement = document.createElement(`img`);
  const commentAuthorElement = document.createElement(`b`);
  const linkElement = document.createElement(`a`);
  commentElement.classList.add(`last__list-item`);
  imageElement.classList.add(`last__list-image`);
  commentAuthorElement.classList.add(`last__list-name`);
  linkElement.classList.add(`last__list-link`);
  commentAuthorElement.textContent = `${user.firstName} ${user.lastName}`;
  imageElement.src = `/img/${user.avatar}`;
  linkElement.href = `/articles/${articleId}`;
  linkElement.textContent = cutString(text);
  commentElement.append(imageElement);
  commentElement.append(commentAuthorElement);
  commentElement.append(linkElement);
  return commentElement;
};

const createArticleElement = (article) => {
  const {id, announce, commentsCount} = article;
  const articleContainerElement = document.createElement(`li`);
  const linkElement = document.createElement(`a`);
  const commentCountElement = document.createElement(`sup`);
  articleContainerElement.classList.add(`hot__list-item`);
  linkElement.classList.add(`hot__list-link`)
  commentCountElement.classList.add(`hot__link-sup`);
  commentCountElement.textContent = commentsCount;
  linkElement.textContent = cutString(announce);
  linkElement.href = `/articles/${id}`;
  linkElement.append(commentCountElement);
  articleContainerElement.append(linkElement);
  return articleContainerElement;
};

const updateArticlesElements = (articles) => {
  const articlesContainerElement = document.querySelector(`.hot__list`);
  articlesContainerElement.textContent = ``;
  articles.forEach((article) => {
    const articleElement = createArticleElement(article);
    articlesContainerElement.append(articleElement);
  });
};

const prependNewCommentElement = (comment) => {
  const commentsElements = commentsListElement.querySelectorAll('li');

  if (commentsElements.length === NEWEST_COMMENTS_QUANTITY) {
    commentsElements[commentsElements.length - 1].remove();
  }

  commentsListElement.prepend(createCommentElement(comment));
};

const updateCommentsElements = (comments) => {
  commentsListElement.textContent = ``;
  comments.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsListElement.append(commentElement);
  });
};

socket.addEventListener(`comment:create`, ({comment, articles}) => {
  updateArticlesElements(articles);
  prependNewCommentElement(comment);
});

socket.addEventListener(`comment:delete`, ({comments, articles}) => {
  updateArticlesElements(articles);
  updateCommentsElements(comments);
});
