const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Honeymoon = sequelize.define('Honeymoon', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  destination: { type: DataTypes.STRING, allowNull: false },
  photoUrl:    { type: DataTypes.TEXT('long') },
  startDate:   { type: DataTypes.DATEONLY },
  endDate:     { type: DataTypes.DATEONLY },
  tripLink:    { type: DataTypes.STRING },
  itinerary:   { type: DataTypes.TEXT },
});

module.exports = Honeymoon;
