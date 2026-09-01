const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define(
  'Rating',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    storeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    storeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'ratings',
    timestamps: true,
  }
);

module.exports = Rating;
