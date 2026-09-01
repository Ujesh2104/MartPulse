const express = require('express');
const router = express.Router();
const { submitRating, updateRating, getUserRatings } = require('../controllers/ratingController');
const { verifyToken } = require('../middlewares/auth');

router.post('/', verifyToken, submitRating);
router.put('/:ratingId', verifyToken, updateRating);
router.get('/my-ratings', verifyToken, getUserRatings);

module.exports = router;
