const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodoItem = sequelize.define('TodoItem', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:    { type: DataTypes.INTEGER, allowNull: false },
  title:     { type: DataTypes.STRING, allowNull: false },
  date:      { type: DataTypes.DATEONLY },
  time:      { type: DataTypes.TIME },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = TodoItem;
