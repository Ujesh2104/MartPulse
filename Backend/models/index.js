const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

User.hasMany(Store, { foreignKey: 'ownerId', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Store.hasMany(Rating, { foreignKey: 'storeId', as: 'ratings' });
Rating.belongsTo(Store, { foreignKey: 'storeId', as: 'store' });

const recalculateStoreRating = async (storeId) => {
  const ratings = await Rating.findAll({ where: { storeId } });
  const store = await Store.findByPk(storeId);
  if (!store) return null;

  if (ratings.length === 0) {
    store.rating = 0;
    store.ratingCount = 0;
  } else {
    const sum = ratings.reduce((acc, curr) => acc + Number(curr.rating), 0);
    store.rating = Number((sum / ratings.length).toFixed(1));
    store.ratingCount = ratings.length;
  }
  await store.save();
  return store;
};

const seedDatabase = async () => {
  const userCount = await User.count();
  if (userCount > 0) return;

  const salt = await bcrypt.genSalt(10);

  const users = await User.bulkCreate([
    {
      id: 'user_admin_1',
      name: 'System Administrator (MartPulse HQ)',
      email: 'admin@martpulse.com',
      password: await bcrypt.hash('Admin@12345', salt),
      address: '101 Executive Tower, Silicon Valley Blvd, CA 94025',
      role: 'ADMIN',
    },
    {
      id: 'user_owner_1',
      name: 'Alexander Sterling Luxury Store Owner',
      email: 'owner@martpulse.com',
      password: await bcrypt.hash('Owner@12345', salt),
      address: '742 Evergreen Terrace, Springfield District, IL 62701',
      role: 'STORE_OWNER',
    },
    {
      id: 'user_normal_1',
      name: 'Christopher Nolan Premium Buyer',
      email: 'user@martpulse.com',
      password: await bcrypt.hash('User@12345', salt),
      address: '123 Baker Street, Marylebone Quarter, London NW1 6XE',
      role: 'NORMAL_USER',
    },
    {
      id: 'user_normal_2',
      name: 'Elena Rostova Gourmet Foodie Enthusiast',
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
      ownerName: 'Alexander Sterling Luxury Store Owner',
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
      ownerName: 'Alexander Sterling Luxury Store Owner',
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
      ownerName: 'Alexander Sterling Luxury Store Owner',
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
      ownerName: 'Alexander Sterling Luxury Store Owner',
      rating: 4.7,
      ratingCount: 1,
      category: 'Modern Mart',
    },
  ]);

  const ratings = await Rating.bulkCreate([
    {
      id: 'rate_1',
      userId: 'user_normal_1',
      userName: 'Christopher Nolan Premium Buyer',
      userEmail: 'user@martpulse.com',
      storeId: 'store_1',
      storeName: 'Apex Luxury Supermart & Emporium',
      rating: 5,
      comment: 'Outstanding quality and world-class customer service. The wine and cheese section is unbeatable!',
    },
    {
      id: 'rate_2',
      userId: 'user_normal_2',
      userName: 'Elena Rostova Gourmet Foodie Enthusiast',
      userEmail: 'elena@martpulse.com',
      storeId: 'store_1',
      storeName: 'Apex Luxury Supermart & Emporium',
      rating: 5,
      comment: 'Very clean aisles and quick checkout experience. Highly recommend.',
    },
    {
      id: 'rate_3',
      userId: 'user_normal_1',
      userName: 'Christopher Nolan Premium Buyer',
      userEmail: 'user@martpulse.com',
      storeId: 'store_2',
      storeName: 'The Artisan Organic Market & Wine Bar',
      rating: 5,
      comment: 'Best organic selections in the region. Always fresh.',
    },
    {
      id: 'rate_4',
      userId: 'user_normal_2',
      userName: 'Elena Rostova Gourmet Foodie Enthusiast',
      userEmail: 'elena@martpulse.com',
      storeId: 'store_3',
      storeName: 'Grand Gourmet Food Hall & Patisserie',
      rating: 5,
      comment: 'Great bakery and friendly staff.',
    },
    {
      id: 'rate_5',
      userId: 'user_normal_1',
      userName: 'Christopher Nolan Premium Buyer',
      userEmail: 'user@martpulse.com',
      storeId: 'store_4',
      storeName: 'Urban Harvest Fresh Emporium',
      rating: 5,
      comment: 'Super fresh veggies and seamless parking access.',
    },
  ]);

  for (const store of stores) {
    await recalculateStoreRating(store.id);
  }
};

const initDB = async () => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  await seedDatabase();
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  initDB,
  recalculateStoreRating,
};
