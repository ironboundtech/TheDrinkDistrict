const jwt = require('jsonwebtoken');
const { User, ROLES } = require('../models/User');

// Helper: try to extract token from common locations
const extractToken = (req) => {
  // 1) Authorization header: Bearer TOKEN
  const authHeader = req.headers && (req.headers['authorization'] || req.headers['Authorization']);
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && /^Bearer$/i.test(parts[0])) return { token: parts[1], source: 'authorization' };
    // fallback: maybe the header contains raw token
    if (parts.length === 1) return { token: parts[0], source: 'authorization-raw' };
  }

  // 2) x-access-token header
  if (req.headers && req.headers['x-access-token']) return { token: req.headers['x-access-token'], source: 'x-access-token' };

  // 3) body token (for forms or JSON payloads)
  if (req.body && req.body.token) return { token: req.body.token, source: 'body.token' };

  // 4) query string token (e.g., ?token=...)
  if (req.query && req.query.token) return { token: req.query.token, source: 'query.token' };

  // 5) cookie (parse manually to avoid adding cookie-parser dependency)
  const cookieHeader = req.headers && req.headers.cookie;
  if (cookieHeader) {
    try {
      const cookies = cookieHeader.split(';').map(c => c.trim()).reduce((acc, pair) => {
        const idx = pair.indexOf('=');
        if (idx > -1) {
          const k = pair.slice(0, idx).trim();
          const v = pair.slice(idx + 1).trim();
          acc[k] = v;
        }
        return acc;
      }, {});
      const token = cookies.token || cookies.authToken || cookies.jwt;
      if (token) return { token, source: 'cookie' };
    } catch (e) {
      // ignore cookie parse errors
    }
  }

  return { token: null, source: null };
};

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const { token, source } = extractToken(req);

    if (!token) {
      // Helpful debug logging in development to diagnose missing auth headers
      if (process.env.NODE_ENV === 'development') {
        try {
          const headerKeys = Object.keys(req.headers || {}).join(', ');
          console.warn('⚠️ authenticateToken: no token provided. Header keys:', headerKeys);
          if (req.headers && req.headers.authorization) {
            const raw = req.headers.authorization;
            console.warn('⚠️ authenticateToken: authorization header present but token parse failed. header preview:', raw.slice(0, 20) + '...');
          }
          if (req.headers && req.headers['x-access-token']) console.warn('⚠️ authenticateToken: x-access-token header present');
          if (req.body && req.body.token) console.warn('⚠️ authenticateToken: token present in body (will be used in next deploy)');
          if (req.query && req.query.token) console.warn('⚠️ authenticateToken: token present in query');
        } catch (e) {
          // ignore logging errors
        }
      }
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive user'
      });
    }

    // Attach small debug hint about token source for logs
    req.user = user;
    req.authInfo = { tokenSource: source || 'unknown' };
    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.warn('⚠️ authenticateToken: token verification error:', error && error.message ? error.message : String(error));
    return res.status(403).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!req.user.hasPermission(requiredRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${requiredRole} role required.` 
      });
    }

    next();
  };
};

// Middleware to check if user is admin
const requireAdmin = requireRole(ROLES.ADMIN);

// Middleware to check if user is manager or admin
const requireManagerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (!req.user.isManagerOrAdmin) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Manager or Admin role required.' 
    });
  }

  next();
};

// Middleware to check if user is staff or higher
const requireStaffOrHigher = requireRole(ROLES.STAFF);

// Middleware to check if user is guest investor or higher
const requireGuestInvestorOrHigher = requireRole(ROLES.GUEST_INVESTOR);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireManagerOrAdmin,
  requireStaffOrHigher,
  requireGuestInvestorOrHigher,
  ROLES
};
