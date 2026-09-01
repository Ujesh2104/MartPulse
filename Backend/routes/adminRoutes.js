const express = require('express');
const router = express.Router();
const { getStats, getUsers, createUser } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/stats', verifyToken, requireRole(['ADMIN']), getStats);
router.get('/users', verifyToken, requireRole(['ADMIN']), getUsers);
router.post('/users', verifyToken, requireRole(['ADMIN']), createUser);

module.exports = router;
