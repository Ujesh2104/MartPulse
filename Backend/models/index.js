const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');
const bcrypt = require('bcryptjs');

User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const recalculateStoreRating = async (storeId) => {
  try {
    const ratings = await Rating.findAll({
      where: { storeId },
      attributes: ['rating'],
    });

    if (ratings.length === 0) {
      await Store.update(
        { rating: 0, ratingCount: 0 },
        { where: { id: storeId } }
      );
      return { averageRating: 0, totalRatings: 0 };
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = parseFloat((sum / ratings.length).toFixed(1));
    const count = ratings.length;

    await Store.update(
      { rating: average, ratingCount: count },
      { where: { id: storeId } }
    );

    return { averageRating: average, totalRatings: count };
  } catch (error) {
    console.error('Recalculate store rating error:', error);
    return null;
  }
};

const initDB = async () => {
  await sequelize.sync();

  const userCount = await User.count();
  if (userCount > 0) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const users = await User.bulkCreate([
    {
      id: 'user_admin_1',
      name: 'Ujesh Mishra (System Administrator)',
      email: 'admin@martpulse.com',
      password: await bcrypt.hash('Admin@12345', salt),
      address: '101 Executive Tower, Silicon Valley Blvd, CA 94025',
      role: 'ADMIN',
    },
    {
      id: 'user_owner_1',
      name: 'Rajesh Sharma (Verified Store Owner)',
      email: 'owner@martpulse.com',
      password: await bcrypt.hash('Owner@12345', salt),
      address: '742 Evergreen Terrace, Springfield District, IL 62701',
      role: 'STORE_OWNER',
    },
    {
      id: 'user_normal_1',
      name: 'Rohan Verma (Verified Shopper)',
      email: 'user@martpulse.com',
      password: await bcrypt.hash('User@12345', salt),
      address: '123 Baker Street, Marylebone Quarter, London NW1 6XE',
      role: 'NORMAL_USER',
    },
    {
      id: 'user_normal_2',
      name: 'Pooja Patel (Gourmet Foodie Shopper)',
      email: 'elena@martpulse.com',
      password: await bcrypt.hash('User@12345', salt),
      address: '880 Ocean Drive, South Beach Waterfront, Miami FL 33139',
      role: 'NORMAL_USER',
    },
  ]);

  const stores = await Store.bulkCreate([
    {
      id: 'store_1',
      name: 'Apex Luxury Supermart & Emporium',
      email: 'owner@martpulse.com',
      address: '450 Fifth Avenue, Midtown Manhattan, New York, NY 10018',
      ownerId: 'user_owner_1',
      ownerName: 'Rajesh Sharma (Verified Store Owner)',
      rating: 4.8,
      ratingCount: 2,
      category: 'Luxury Supermarket',
    },
    {
      id: 'store_2',
      name: 'The Artisan Organic Market & Wine Bar',
      email: 'artisan@martpulse.com',
      address: '880 Ocean Drive, South Beach Promenade, Miami, FL 33139',
      ownerId: 'user_owner_1',
      ownerName: 'Rajesh Sharma (Verified Store Owner)',
      rating: 4.9,
      ratingCount: 1,
      category: 'Organic Grocery',
    },
    {
      id: 'store_3',
      name: 'Grand Gourmet Food Hall & Patisserie',
      email: 'grandgourmet@martpulse.com',
      address: '1200 Sunset Boulevard, West Hollywood, Los Angeles, CA 90069',
      ownerId: 'user_owner_1',
      ownerName: 'Rajesh Sharma (Verified Store Owner)',
      rating: 4.5,
      ratingCount: 1,
      category: 'Gourmet Deli',
    },
    {
      id: 'store_4',
      name: 'Urban Harvest Fresh Emporium',
      email: 'urbanharvest@martpulse.com',
      address: '77 Market Street, Downtown District, Seattle, WA 98101',
      ownerId: 'user_owner_1',
      ownerName: 'Rajesh Sharma (Verified Store Owner)',
      rating: 4.7,
      ratingCount: 1,
      category: 'Modern Mart',
    },
  ]);

  await Rating.bulkCreate([
    {
      id: 'rating_1',
      storeId: 'store_1',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      rating: 5,
      comment: 'Flawless luxury shopping experience! Outstanding produce and lightning-fast checkout.',
    },
    {
      id: 'rating_2',
      storeId: 'store_1',
      userId: 'user_normal_2',
      userName: 'Pooja Patel (Gourmet Foodie Shopper)',
      rating: 4,
      comment: 'Very good quality organic vegetables and rare imported condiments.',
    },
    {
      id: 'rating_3',
      storeId: 'store_2',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      rating: 5,
      comment: 'Best organic bakery and cheese section in the entire city.',
    },
    {
      id: 'rating_4',
      storeId: 'store_3',
      userId: 'user_normal_2',
      userName: 'Pooja Patel (Gourmet Foodie Shopper)',
      rating: 5,
      comment: 'Freshly baked pastries and exceptional customer service.',
    },
    {
      id: 'rating_5',
      storeId: 'store_4',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      rating: 4,
      comment: 'Clean aisles, well-organized sections, and friendly staff.',
    },
  ]);

  for (const store of stores) {
    await recalculateStoreRating(store.id);
  }
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  recalculateStoreRating,
  initDB,
};
