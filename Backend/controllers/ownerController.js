const { Store, Rating, User } = require('../models');

const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    let stores = await Store.findAll({
      where: { ownerId },
    });

    if (stores.length === 0) {
      const allStores = await Store.findAll();
      const matched = allStores.find(
        (s) => (s.email && s.email.toLowerCase() === req.user.email.toLowerCase()) || s.ownerId === ownerId
      );
      if (matched) {
        stores = [matched];
      } else if (allStores.length > 0 && req.user.role === 'ADMIN') {
        stores = allStores;
      } else if (allStores.length > 0) {
        stores = [allStores[0]];
      }
    }

    const storeIds = stores.map((s) => s.id);
    const ownerRatings = await Rating.findAll({
      where: { storeId: storeIds },
      order: [['createdAt', 'DESC']],
    });

    const totalReviews = ownerRatings.length;
    let averageRating = 0;
    if (totalReviews > 0) {
      const sum = ownerRatings.reduce((acc, curr) => acc + Number(curr.rating), 0);
      averageRating = Number((sum / totalReviews).toFixed(1));
    } else if (stores.length > 0 && stores[0].rating) {
      averageRating = stores[0].rating;
    }

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ownerRatings.forEach((r) => {
      const star = Math.round(r.rating);
      if (distribution[star] !== undefined) {
        distribution[star] += 1;
      }
    });

    const customerReviews = ownerRatings.map((r) => {
      const store = stores.find((s) => s.id === r.storeId) || { name: r.storeName || 'Store' };
      return {
        id: r.id,
        userName: r.userName || 'Anonymous User',
        userEmail: r.userEmail || 'user@example.com',
        storeId: r.storeId,
        storeName: store.name,
        rating: r.rating,
        comment: r.comment || '',
        createdAt: r.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      store: stores[0] || null,
      stores,
      stats: {
        averageRating,
        totalReviews,
        distribution,
      },
      reviews: customerReviews,
    });
  } catch (error) {
    console.error('Owner dashboard error:', error);
    return res.status(500).json({ message: 'Failed to retrieve owner dashboard data.' });
  }
};

module.exports = {
  getOwnerDashboard,
};
