const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GiftEntry = sequelize.define('GiftEntry', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:  { type: DataTypes.INTEGER, allowNull: false },
  guestId:   { type: DataTypes.INTEGER },
  giverName: { type: DataTypes.STRING },
  amount:    { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  message:   { type: DataTypes.TEXT },
});

module.exports = GiftEntry;
