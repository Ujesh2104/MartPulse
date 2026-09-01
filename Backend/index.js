require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./models');

const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'MartPulse Backend API',
    database: 'MySQL (Sequelize)',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth',
      stores: '/api/stores',
      ratings: '/api/ratings',
      admin: '/api/admin',
      owner: '/api/owner',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'MySQL', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    message: 'An unexpected internal server error occurred.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

const startServer = async () => {
  try {
    await initDB();
    console.log('⚡ MySQL Database connected and synced successfully');

    app.listen(PORT, () => {
      console.log(`⚡ MartPulse API Server running on port ${PORT}`);
      console.log(`🔗 Local URL: http://localhost:${PORT}`);
      console.log(`🔗 Health:    http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to initialize database and start server:', error);
    process.exit(1);
  }
};

startServer();
