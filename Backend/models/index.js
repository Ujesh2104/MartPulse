const sequelize = require('../config/database');
const UserSequelize = require('./User');
const StoreSequelize = require('./Store');
const RatingSequelize = require('./Rating');
const { memoryUser, memoryStore, memoryRating, memorySequelize } = require('./inMemoryStore');
const bcrypt = require('bcryptjs');

UserSequelize.hasMany(StoreSequelize, { foreignKey: 'ownerId', as: 'stores' });
StoreSequelize.belongsTo(UserSequelize, { foreignKey: 'ownerId', as: 'owner' });

StoreSequelize.hasMany(RatingSequelize, { foreignKey: 'storeId', as: 'ratings', onDelete: 'CASCADE' });
RatingSequelize.belongsTo(StoreSequelize, { foreignKey: 'storeId', as: 'store' });

UserSequelize.hasMany(RatingSequelize, { foreignKey: 'userId', as: 'ratings', onDelete: 'CASCADE' });
RatingSequelize.belongsTo(UserSequelize, { foreignKey: 'userId', as: 'user' });

let activeEngine = 'pending'; // 'mysql' | 'memory'

// Transparent Proxies that route calls to either Sequelize (MySQL) or Memory Store
const createModelProxy = (sequelizeModel, memoryModel) => {
  return new Proxy(sequelizeModel, {
    get(target, prop) {
      if (activeEngine === 'memory') {
        if (typeof memoryModel[prop] === 'function') {
          return memoryModel[prop].bind(memoryModel);
        }
        return memoryModel[prop];
      }
      return target[prop];
    },
  });
};

const User = createModelProxy(UserSequelize, memoryUser);
const Store = createModelProxy(StoreSequelize, memoryStore);
const Rating = createModelProxy(RatingSequelize, memoryRating);

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

let dbState = {
  connected: false,
  engine: 'initializing',
  error: null,
  lastAttempt: null,
};

const getDBStatus = () => ({
  connected: dbState.connected,
  engine: dbState.engine,
  error: dbState.error,
  lastAttempt: dbState.lastAttempt,
});

const seedDatabase = async (targetUser, targetStore, targetRating) => {
  console.log('🌱 Seeding initial demo profiles and catalog...');
  const salt = await bcrypt.genSalt(10);
  const users = await targetUser.bulkCreate([
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

  const stores = await targetStore.bulkCreate([
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

  await targetRating.bulkCreate([
    {
      id: 'rating_1',
      storeId: 'store_1',
      storeName: 'Apex Luxury Supermart & Emporium',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      userEmail: 'user@martpulse.com',
      rating: 5,
      comment: 'Flawless luxury shopping experience! Outstanding produce and lightning-fast checkout.',
    },
    {
      id: 'rating_2',
      storeId: 'store_1',
      storeName: 'Apex Luxury Supermart & Emporium',
      userId: 'user_normal_2',
      userName: 'Pooja Patel (Gourmet Foodie Shopper)',
      userEmail: 'elena@martpulse.com',
      rating: 4,
      comment: 'Very good quality organic vegetables and rare imported condiments.',
    },
    {
      id: 'rating_3',
      storeId: 'store_2',
      storeName: 'The Artisan Organic Market & Wine Bar',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      userEmail: 'user@martpulse.com',
      rating: 5,
      comment: 'Best organic bakery and cheese section in the entire city.',
    },
    {
      id: 'rating_4',
      storeId: 'store_3',
      storeName: 'Grand Gourmet Food Hall & Patisserie',
      userId: 'user_normal_2',
      userName: 'Pooja Patel (Gourmet Foodie Shopper)',
      userEmail: 'elena@martpulse.com',
      rating: 5,
      comment: 'Freshly baked pastries and exceptional customer service.',
    },
    {
      id: 'rating_5',
      storeId: 'store_4',
      storeName: 'Urban Harvest Fresh Emporium',
      userId: 'user_normal_1',
      userName: 'Rohan Verma (Verified Shopper)',
      userEmail: 'user@martpulse.com',
      rating: 4,
      comment: 'Clean aisles, well-organized sections, and friendly staff.',
    },
  ]);

  for (const store of stores) {
    await recalculateStoreRating(store.id);
  }
  console.log('✅ Demo profiles & catalogs seeded successfully.');
};

const initDB = async (retries = 2, delayMs = 2000) => {
  dbState.lastAttempt = new Date().toISOString();

  // 1. Try MySQL Connection
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📡 Checking MySQL database connection (attempt ${attempt}/${retries})...`);
      await sequelize.authenticate();
      await sequelize.sync();
      activeEngine = 'mysql';
      dbState.connected = true;
      dbState.engine = 'MySQL (Sequelize)';
      dbState.error = null;
      console.log('⚡ MySQL Database connected and synced successfully');

      const userCount = await UserSequelize.count();
      if (userCount === 0) {
        await seedDatabase(UserSequelize, StoreSequelize, RatingSequelize);
      }
      return true;
    } catch (error) {
      console.warn(`⚠️ MySQL attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delayMs));
      }
    }
  }

  // 2. Seamlessly Fallback to Pure JavaScript In-Memory Engine
  console.log('🚀 Activating Pure JavaScript In-Memory Data Engine (100% Fail-Safe, Zero GLIBC/Binary Dependencies)...');
  activeEngine = 'memory';
  dbState.connected = true;
  dbState.engine = 'In-Memory (Pure JS)';
  dbState.error = null;

  const count = await memoryUser.count();
  if (count === 0) {
    await seedDatabase(memoryUser, memoryStore, memoryRating);
  }
  console.log('⚡ Pure In-Memory Data Engine is live and fully ready.');
  return true;
};

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
  recalculateStoreRating,
  initDB,
  getDBStatus,
};


