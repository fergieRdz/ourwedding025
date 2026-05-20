const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BudgetItem = sequelize.define('BudgetItem', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  category:    { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  amount:      { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paid:   { type: DataTypes.BOOLEAN, defaultValue: false },
  isDebt: { type: DataTypes.BOOLEAN, defaultValue: false },
  date:   { type: DataTypes.DATEONLY },
});

module.exports = BudgetItem;
