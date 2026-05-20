const { Table, Guest } = require('../models');

const getAll = async (req, res) => {
  try {
    const tables = await Table.findAll({
      where: { userId: req.userId },
      include: [{ model: Guest, attributes: ['id', 'name', 'status'] }],
    });
    res.json(tables);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const table = await Table.create({ userId: req.userId, tableNumber, capacity });
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const table = await Table.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    await table.update(req.body);
    res.json(table);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update };
