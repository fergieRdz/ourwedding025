const sequelize = require('../config/database');

const User          = require('./User');
const Guest         = require('./Guest');
const Table         = require('./Table');
const Supplier      = require('./Supplier');
const BudgetItem    = require('./BudgetItem');
const GiftEntry     = require('./GiftEntry');
const CalendarEvent = require('./CalendarEvent');
const TodoItem      = require('./TodoItem');
const ShoppingItem  = require('./ShoppingItem');
const MoodboardPhoto = require('./MoodboardPhoto');
const Honeymoon     = require('./Honeymoon');

// Associations
User.hasMany(Guest,         { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Table,         { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Supplier,      { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(BudgetItem,    { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(GiftEntry,     { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(CalendarEvent, { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(TodoItem,      { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(ShoppingItem,  { foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(MoodboardPhoto,{ foreignKey: 'userId', onDelete: 'CASCADE' });
User.hasMany(Honeymoon,     { foreignKey: 'userId', onDelete: 'CASCADE' });

Guest.belongsTo(User,  { foreignKey: 'userId' });
Guest.belongsTo(Table, { foreignKey: 'tableId' });
Table.hasMany(Guest,   { foreignKey: 'tableId' });
GiftEntry.belongsTo(Guest, { foreignKey: 'guestId' });

module.exports = {
  sequelize,
  User,
  Guest,
  Table,
  Supplier,
  BudgetItem,
  GiftEntry,
  CalendarEvent,
  TodoItem,
  ShoppingItem,
  MoodboardPhoto,
  Honeymoon,
};
