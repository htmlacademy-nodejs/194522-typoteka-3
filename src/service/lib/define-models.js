'use strict';

const {Model} = require(`sequelize`);
const {
  defineArticle,
  defineCategory,
  defineComment,
  defineUser,
} = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = (sequelize) => {
  const Article = defineArticle(sequelize);
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const User = defineUser(sequelize);

  Article.hasMany(Comment, {foreignKey: `articleId`, as: Aliase.COMMENTS, onDelete: `CASCADE`});
  Comment.belongsTo(Article, {foreignKey: `articleId`, as: Aliase.ARTICLE});

  User.hasMany(Article, {foreignKey: `userId`, as: Aliase.ARTICLES});
  Article.belongsTo(User, {foreignKey: `userId`});

  User.hasMany(Comment, {foreignKey: `userId`, as: Aliase.COMMENTS});
  Comment.belongsTo(User, {foreignKey: `userId`, as: Aliase.USER});

  class ArticlesCategories extends Model {}
  ArticlesCategories.init({}, {sequelize});

  Article.belongsToMany(Category, {through: ArticlesCategories, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticlesCategories, as: Aliase.ARTICLES});
  Category.hasMany(ArticlesCategories, {as: Aliase.ARTICLES_CATEGORIES});
  Article.hasMany(ArticlesCategories, {as: Aliase.ARTICLES_CATEGORIES});

  return {
    Article,
    Category,
    Comment,
    User,
    ArticlesCategories
  };
};
