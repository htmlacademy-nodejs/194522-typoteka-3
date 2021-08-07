'use strict';

const {DataTypes, Model} = require(`sequelize`);

module.exports = (sequelize) => {
  class Category extends Model {}

  Category.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: `Category`,
    tableName: `categories`
  });

  return Category;
};
