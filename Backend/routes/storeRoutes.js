const express = require('express');
const router = express.Router();
const { getAllStores, createStore } = require('../controllers/storeController');
const { verifyToken, requireRole, optionalAuth } = require('../middlewares/auth');

router.get('/', optionalAuth, getAllStores);
router.post('/', verifyToken, requireRole(['ADMIN', 'STORE_OWNER']), createStore);

module.exports = router;
