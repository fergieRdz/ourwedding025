const router = require('express').Router();
const { getAll, create, update } = require('../controllers/shoppingController');
const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken);
router.get('/',    getAll);
router.post('/',   create);
router.put('/:id', update);

module.exports = router;
