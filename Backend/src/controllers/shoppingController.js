const { ShoppingItem } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await ShoppingItem.findAll({ where: { userId: req.userId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, quantity, deadline } = req.body;
    const item = await ShoppingItem.create({ userId: req.userId, name, quantity, deadline });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const item = await ShoppingItem.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update };
