const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Supplier = sequelize.define('Supplier', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:   { type: DataTypes.INTEGER, allowNull: false },
  name:     { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING },
  phone:    { type: DataTypes.STRING },
  status:   { type: DataTypes.ENUM('confirmed', 'pending'), defaultValue: 'pending' },
  photoUrl: { type: DataTypes.TEXT('long') },
  notes:    { type: DataTypes.TEXT },
});

module.exports = Supplier;
