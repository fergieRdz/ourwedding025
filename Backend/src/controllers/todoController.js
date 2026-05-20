const { TodoItem } = require('../models');

const getAll = async (req, res) => {
  try {
    const todos = await TodoItem.findAll({ where: { userId: req.userId }, order: [['date', 'ASC'], ['time', 'ASC']] });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { title, date, time } = req.body;
    const todo = await TodoItem.create({ userId: req.userId, title, date, time });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const todo = await TodoItem.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    await todo.update(req.body);
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, update };
