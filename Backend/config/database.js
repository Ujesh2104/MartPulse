const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const hasRemoteMySQL = Boolean(
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  (process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1')
);

// If explicitly requested sqlite or if in production without a remote MySQL host, use SQLite
const useSQLite = process.env.DB_DIALECT === 'sqlite' || (isProduction && !hasRemoteMySQL);

let sequelize;

if (useSQLite) {
  const dbPath = process.env.SQLITE_PATH || path.join(__dirname, '../martpulse.sqlite');
  console.log(`📦 Initializing embedded SQLite database engine at: ${dbPath}`);
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: false,
  });
} else if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
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
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
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
        acquire: 30000,
        idle: 10000,
      },
      retry: {
        max: 3,
      },
    }
  );
}

module.exports = sequelize;


