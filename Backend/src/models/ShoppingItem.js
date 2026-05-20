const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingItem = sequelize.define('ShoppingItem', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:    { type: DataTypes.INTEGER, allowNull: false },
  name:      { type: DataTypes.STRING, allowNull: false },
  quantity:  { type: DataTypes.INTEGER, defaultValue: 1 },
  deadline:  { type: DataTypes.DATEONLY },
  purchased: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = ShoppingItem;
