const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
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
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'STORE_OWNER', 'NORMAL_USER'),
      defaultValue: 'NORMAL_USER',
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
