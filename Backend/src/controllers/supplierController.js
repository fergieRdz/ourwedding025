const { Supplier } = require('../models');

const getAll = async (req, res) => {
  try {
    const { category, search } = req.query;
    const where = { userId: req.userId };
    if (category) where.category = category;
    const { Op } = require('sequelize');
    if (search) where.name = { [Op.like]: `%${search}%` };
    const suppliers = await Supplier.findAll({ where });
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { name, category, phone, status, photoUrl, notes } = req.body;
    const supplier = await Supplier.create({ userId: req.userId, name, category, phone, status, photoUrl, notes });
    res.status(201).json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const supplier = await Supplier.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    await supplier.update(req.body);
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await Supplier.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Supplier not found' });
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update, remove };
