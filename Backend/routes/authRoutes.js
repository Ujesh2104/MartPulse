const express = require('express');
const router = express.Router();
const { login, register, changePassword, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/change-password', verifyToken, changePassword);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
