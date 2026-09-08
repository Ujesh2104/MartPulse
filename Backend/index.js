require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB, getDBStatus } = require('./models');

const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

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
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    project: 'MartPulse Backend API',
    database: dbStatus.connected ? 'MySQL (Connected)' : 'MySQL (Connecting/Pending)',
    dbDetails: dbStatus,
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
  const dbStatus = getDBStatus();
  res.status(dbStatus.connected ? 200 : 200).json({
    status: 'healthy',
    database: dbStatus.connected ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbError: dbStatus.error,
  });
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

// Process-level resilience against crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
});

// Start listening immediately on 0.0.0.0 to satisfy Render container port health check
const server = app.listen(PORT, HOST, () => {
  console.log(`⚡ MartPulse API Server running on http://${HOST}:${PORT}`);
  console.log(`🔗 Health check available at: http://${HOST}:${PORT}/api/health`);

  // Initialize DB asynchronously with automatic retries
  initDB().catch((err) => {
    console.error('Initial DB connection task encountered an error:', err);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing HTTP server gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

