const { CalendarEvent } = require('../models');

const getAll = async (req, res) => {
  try {
    const events = await CalendarEvent.findAll({ where: { userId: req.userId }, order: [['date', 'ASC'], ['time', 'ASC']] });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, date, time, reminderEnabled, notes } = req.body;
    const event = await CalendarEvent.create({ userId: req.userId, title, date, time, reminderEnabled, notes });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const event = await CalendarEvent.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    await event.update(req.body);
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await CalendarEvent.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update, remove };
