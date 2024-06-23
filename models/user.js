'use strict';
const {
  Model
} = require('sequelize');
const { hash } = require('./../helpers/hash');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name cannot be omitted'
        },
        notEmpty: {
          msg: 'name cannot be an empty string'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'email cannot be omitted'
        },
        notEmpty: {
          msg: 'email cannot be an empty string'
        },
        isEmail: {
          msg: 'email must be an accurate email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 10],
          msg: 'password must be 6-10 character'
        },
        notNull: {
          msg: 'password cannot be omitted'
        },
        notEmpty: {
          msg: 'password cannot be an empty string'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate(instance){
        instance.password = hash(instance.password)
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};