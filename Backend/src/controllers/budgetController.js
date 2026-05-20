const { BudgetItem, GiftEntry } = require('../models');

const getAll = async (req, res) => {
  try {
    const items = await BudgetItem.findAll({ where: { userId: req.userId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { category, description, amount, paid, date, isDebt } = req.body;
    const item = await BudgetItem.create({ userId: req.userId, category, description, amount, paid, date, isDebt });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const item = await BudgetItem.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!item) return res.status(404).json({ message: 'Budget item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await BudgetItem.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Budget item not found' });
    res.json({ message: 'Budget item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSummary = async (req, res) => {
  try {
    const items = await BudgetItem.findAll({ where: { userId: req.userId } });
    const totalSpent = items.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const totalPaid  = items.filter(i => i.paid).reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const gifts = await GiftEntry.findAll({ where: { userId: req.userId } });
    const totalGifts = gifts.reduce((sum, g) => sum + parseFloat(g.amount), 0);
    res.json({ totalSpent, totalPaid, totalPending: totalSpent - totalPaid, totalGifts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createGift = async (req, res) => {
  try {
    const { guestId, giverName, amount, message } = req.body;
    const gift = await GiftEntry.create({ userId: req.userId, guestId, giverName, amount, message });
    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update, remove, getSummary, createGift };
