const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CalendarEvent = sequelize.define('CalendarEvent', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:          { type: DataTypes.INTEGER, allowNull: false },
  title:           { type: DataTypes.STRING, allowNull: false },
  date:            { type: DataTypes.DATEONLY, allowNull: false },
  time:            { type: DataTypes.TIME },
  reminderEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  notes:           { type: DataTypes.TEXT },
});

module.exports = CalendarEvent;
