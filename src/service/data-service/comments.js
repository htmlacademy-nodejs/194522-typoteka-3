'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentsService {
  findAll(article) {
    return article.comments;
  }

  delete(article, commentId) {
    const commentToDelete = article.comments.find((comment) => comment.id === commentId);
    if (!commentToDelete) {
      return null;
    }

    article.comments = article.comments.filter((comment) => comment.id !== commentId);
    return commentToDelete;
  }

  create(article, comment) {
    const newComment = Object.assign(comment, {
      id: nanoid(MAX_ID_LENGTH)
    });
    article.comments.push(newComment);
    return newComment;
  }
}

module.exports = CommentsService;
