const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { validateName, validateEmail, validateAddress } = require('../utils/validators');

const getAllStores = async (req, res) => {
  try {
    const { search = '', sort = '', category = '' } = req.query;

    const whereClause = {};

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      whereClause[Op.or] = [
        { name: { [Op.like]: q } },
        { address: { [Op.like]: q } },
        { category: { [Op.like]: q } },
      ];
    }

    if (category && category !== 'All' && category !== 'ALL') {
      whereClause.category = category;
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'rating_desc' || sort === 'rating' || sort === 'averageRating:desc') {
      order = [['rating', 'DESC']];
    } else if (sort === 'rating_asc' || sort === 'averageRating:asc') {
      order = [['rating', 'ASC']];
    } else if (sort === 'name_asc') {
      order = [['name', 'ASC']];
    } else if (sort === 'name_desc') {
      order = [['name', 'DESC']];
    }

    const stores = await Store.findAll({
      where: whereClause,
      order,
    });

    const userId = req.user ? req.user.id : null;
    let userRatingsMap = {};

    if (userId) {
      const userRatings = await Rating.findAll({ where: { userId } });
      userRatings.forEach((r) => {
        userRatingsMap[r.storeId] = r.rating;
      });
    }

    const enrichedStores = stores.map((s) => {
      const storeObj = s.toJSON();
      return {
        ...storeObj,
        userRating: userRatingsMap[s.id] || null,
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedStores.length,
      stores: enrichedStores,
    });
  } catch (error) {
    console.error('Get stores error:', error);
    return res.status(500).json({ message: 'Failed to fetch stores.' });
  }
};

const createStore = async (req, res) => {
  try {
    const { name, email, address, category = 'Supermarket', ownerId } = req.body;

    const nameCheck = validateName(name);
    if (!nameCheck.isValid) return res.status(400).json({ message: nameCheck.message });

    const emailCheck = validateEmail(email);
    if (!emailCheck.isValid) return res.status(400).json({ message: emailCheck.message });

    const addrCheck = validateAddress(address);
    if (!addrCheck.isValid) return res.status(400).json({ message: addrCheck.message });

    let finalOwnerId = ownerId || req.user.id;
    let ownerName = req.user.name;

    if (ownerId && ownerId !== req.user.id) {
      const targetOwner = await User.findByPk(ownerId);
      if (targetOwner) {
        ownerName = targetOwner.name;
      }
    }

    const newStore = await Store.create({
      id: 'store_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      category: category.trim(),
      ownerId: finalOwnerId,
      ownerName: ownerName,
      rating: 0,
      ratingCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: 'Store created successfully',
      store: newStore,
    });
  } catch (error) {
    console.error('Create store error:', error);
    return res.status(500).json({ message: 'Failed to create store.' });
  }
};

module.exports = {
  getAllStores,
  createStore,
};
