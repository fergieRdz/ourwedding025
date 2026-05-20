const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Guest = sequelize.define('Guest', {
  id:      { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:  { type: DataTypes.INTEGER, allowNull: false },
  tableId: { type: DataTypes.INTEGER },
  name:    { type: DataTypes.STRING, allowNull: false },
  email:   { type: DataTypes.STRING },
  phone:   { type: DataTypes.STRING },
  status:  { type: DataTypes.ENUM('confirmed', 'unconfirmed', 'pending'), defaultValue: 'pending' },
});

module.exports = Guest;
