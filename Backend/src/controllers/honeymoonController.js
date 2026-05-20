const { Honeymoon } = require('../models');

const getAll = async (req, res) => {
  try {
    const entries = await Honeymoon.findAll({ where: { userId: req.userId } });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { destination, photoUrl, startDate, endDate, tripLink, itinerary } = req.body;
    const entry = await Honeymoon.create({ userId: req.userId, destination, photoUrl, startDate, endDate, tripLink, itinerary });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const entry = await Honeymoon.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!entry) return res.status(404).json({ message: 'Honeymoon entry not found' });
    await entry.update(req.body);
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Honeymoon.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Honeymoon entry not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update, remove };
