const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protect routes — verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach admin user to request (exclude password)
      req.admin = await Admin.findById(decoded.id).select('-password');

      if (!req.admin) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized — admin not found'
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized — token invalid or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized — no token provided'
    });
  }
};

// Admin-only access check
const adminOnly = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — admin access only'
    });
  }
};

module.exports = { protect, adminOnly };
