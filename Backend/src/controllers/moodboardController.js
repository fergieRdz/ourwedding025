const { MoodboardPhoto } = require('../models');

const getAll = async (req, res) => {
  try {
    const photos = await MoodboardPhoto.findAll({ where: { userId: req.userId } });
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = async (req, res) => {
  try {
    const { imageUrl, category } = req.body;
    const photo = await MoodboardPhoto.create({ userId: req.userId, imageUrl, category });
    res.status(201).json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await MoodboardPhoto.destroy({ where: { id: req.params.id, userId: req.userId } });
    if (!deleted) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAll, create, remove };
