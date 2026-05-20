const router = require('express').Router();
const { getAll, create, update, remove, getSummary, createGift } = require('../controllers/budgetController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/summary', getSummary);
router.get('/',        getAll);
router.post('/',       create);
router.put('/:id',     update);
router.delete('/:id',  remove);
router.post('/gifts',  createGift);

module.exports = router;
