const router = require('express').Router();
const { getAll, create, remove } = require('../controllers/moodboardController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/',       getAll);
router.post('/',      create);
router.delete('/:id', remove);

module.exports = router;
