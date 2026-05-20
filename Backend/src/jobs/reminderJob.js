const cron = require('node-cron');
const { CalendarEvent, TodoItem, User } = require('../models');
const { Op } = require('sequelize');

// Runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
  const today = new Date().toISOString().split('T')[0];

  const events = await CalendarEvent.findAll({
    where: { date: today, reminderEnabled: true },
    include: [{ model: User, attributes: ['name', 'email'] }],
  });

  const todos = await TodoItem.findAll({
    where: { date: today, completed: false },
  });

  if (events.length === 0 && todos.length === 0) return;

  console.log(`\n[Reminder - ${today}]`);
  events.forEach(e => console.log(`  EVENT: ${e.title} at ${e.time || 'all day'}`));
  todos.forEach(t  => console.log(`  TODO:  ${t.title} at ${t.time || 'anytime'}`));
});
