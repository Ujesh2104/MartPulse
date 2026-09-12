const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'martpulse_super_secret_jwt_key_2025';

// Server-side revoked / invalidated token store (with automatic cleanup)
const revokedTokens = new Map(); // token -> expiryTimestamp

const revokeToken = (token) => {
  if (!token) return;
  try {
    const decoded = jwt.decode(token);
    const exp = decoded?.exp ? decoded.exp * 1000 : Date.now() + 24 * 60 * 60 * 1000;
    revokedTokens.set(token, exp);
  } catch {
    revokedTokens.set(token, Date.now() + 24 * 60 * 60 * 1000);
  }
};

const isTokenRevoked = (token) => {
  if (!token) return true;
  if (!revokedTokens.has(token)) return false;
  const expiry = revokedTokens.get(token);
  if (Date.now() > expiry) {
    revokedTokens.delete(token);
    return false;
  }
  return true;
};

// Periodic garbage collection for expired blacklist entries
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of revokedTokens.entries()) {
    if (now > expiry) {
      revokedTokens.delete(token);
    }
  }
}, 60 * 60 * 1000);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];

  if (isTokenRevoked(token)) {
    return res.status(401).json({
      message: 'Token has expired and was revoked upon logout. Please log in again.',
      expired: true,
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User account not found or expired.' });
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      address: user.address,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Your session token has expired. Please log in again.',
        expired: true,
      });
    }
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (isTokenRevoked(token)) {
      return next();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      if (user) {
        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: user.address,
        };
      }
    } catch (err) {
    }
  }
  next();
};

module.exports = {
  JWT_SECRET,
  verifyToken,
  requireRole,
  optionalAuth,
  revokeToken,
  isTokenRevoked,
};

