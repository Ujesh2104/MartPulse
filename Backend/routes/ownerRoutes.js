const express = require('express');
const router = express.Router();
const { getOwnerDashboard } = require('../controllers/ownerController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/dashboard', verifyToken, requireRole(['STORE_OWNER', 'ADMIN']), getOwnerDashboard);

module.exports = router;
