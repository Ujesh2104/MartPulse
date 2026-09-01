const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define(
  'Store',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      defaultValue: 'Luxury Supermarket',
    },
    ownerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: 'stores',
    timestamps: true,
  }
);

module.exports = Store;
