'use strict';

const {Model, DataTypes} = require(`sequelize`);

module.exports = (sequelize) => {
  class Article extends Model {}

  Article.init({
    announce: {
      type: DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: `Article`,
    tableName: `articles`
  });

  return Article;
};
