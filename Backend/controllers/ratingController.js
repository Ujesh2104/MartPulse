const { Rating, Store, recalculateStoreRating } = require('../models');
const { validateRating } = require('../utils/validators');

const submitRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!storeId) {
      return res.status(400).json({ message: 'Store ID is required.' });
    }

    const ratingCheck = validateRating(rating);
    if (!ratingCheck.isValid) {
      return res.status(400).json({ message: ratingCheck.message });
    }

    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    let existingRating = await Rating.findOne({
      where: { userId, storeId },
    });

    if (existingRating) {
      existingRating.rating = Number(rating);
      if (comment !== undefined) {
        existingRating.comment = comment ? comment.trim() : '';
      }
      await existingRating.save();
    } else {
      existingRating = await Rating.create({
        id: 'rate_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        userId,
        userName: req.user.name,
        userEmail: req.user.email,
        storeId,
        storeName: store.name,
        rating: Number(rating),
        comment: comment ? comment.trim() : '',
      });
    }

    const updatedStore = await recalculateStoreRating(storeId);

    return res.status(200).json({
      success: true,
      message: 'Rating submitted successfully.',
      rating: existingRating,
      store: updatedStore,
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    return res.status(500).json({ message: 'Failed to submit rating.' });
  }
};

const updateRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { rating, comment } = req.body;

    if (rating !== undefined) {
      const ratingCheck = validateRating(rating);
      if (!ratingCheck.isValid) {
        return res.status(400).json({ message: ratingCheck.message });
      }
    }

    const targetRating = await Rating.findByPk(ratingId);
    if (!targetRating) {
      return res.status(404).json({ message: 'Rating record not found.' });
    }

    if (targetRating.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to modify this rating.' });
    }

    if (rating !== undefined) targetRating.rating = Number(rating);
    if (comment !== undefined) targetRating.comment = comment ? comment.trim() : '';
    await targetRating.save();

    await recalculateStoreRating(targetRating.storeId);

    return res.status(200).json({
      success: true,
      message: 'Rating updated successfully.',
      rating: targetRating,
    });
  } catch (error) {
    console.error('Update rating error:', error);
    return res.status(500).json({ message: 'Failed to update rating.' });
  }
};

const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      success: true,
      count: ratings.length,
      ratings,
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    return res.status(500).json({ message: 'Failed to fetch your ratings.' });
  }
};

module.exports = {
  submitRating,
  updateRating,
  getUserRatings,
};
