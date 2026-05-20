const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Table = sequelize.define('Table', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  tableNumber: { type: DataTypes.INTEGER, allowNull: false },
  capacity:    { type: DataTypes.INTEGER, defaultValue: 8 },
});

module.exports = Table;
