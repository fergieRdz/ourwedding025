const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MoodboardPhoto = sequelize.define('MoodboardPhoto', {
  id:       { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:   { type: DataTypes.INTEGER, allowNull: false },
  imageUrl: { type: DataTypes.TEXT('long'), allowNull: false },
  category: { type: DataTypes.STRING },
});

module.exports = MoodboardPhoto;
