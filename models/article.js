'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Article.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title cannot be omitted'
        },
        notEmpty: {
          msg: 'Title cannot be an empty string'
        }
      }
    },
    description: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description cannot be omitted'
        },
        notEmpty: {
          msg: 'Description cannot be an empty string'
        }
      }
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image URL cannot be omitted'
        },
        notEmpty: {
          msg: 'Image URL cannot be an empty string'
        },
        isUrl: {
          msg: 'Wrong URL format'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Article',
  });
  return Article;
};