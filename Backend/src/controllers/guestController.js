const { Guest } = require('../models');

const getAll = async (req, res) => {
  try {
    const guests = await Guest.findAll({ where: { userId: req.userId } });
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, email, phone, status, tableId } = req.body;
    const guest = await Guest.create({ userId: req.userId, name, email, phone, status, tableId });
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const guest = await Guest.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!guest) return res.status(404).json({ message: 'Guest not found' });
    await guest.update(req.body);
    res.json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Guest.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Guest not found' });
    res.json({ message: 'Guest deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update, remove };
