const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const hasRemoteMySQL = Boolean(
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
);

let sequelize;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const isSSL = process.env.DB_SSL === 'true' || (isProduction && process.env.DB_SSL !== 'false');
  sequelize = new Sequelize(dbUrl, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: isSSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    pool: {
      max: 10,
      min: 0,
      acquire: 15000,
      idle: 10000,
    },
    retry: {
      max: 2,
    },
  });
} else {
  const isSSL = process.env.DB_SSL === 'true';
  sequelize = new Sequelize(
    process.env.DB_NAME || 'martpulse_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: false,
      dialectOptions: isSSL
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : {},
      pool: {
        max: 10,
        min: 0,
        acquire: 15000,
        idle: 10000,
      },
      retry: {
        max: 2,
      },
    }
  );
}

module.exports = sequelize;



