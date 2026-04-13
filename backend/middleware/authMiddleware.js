const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

// Protect routes — verify JWT token (Supports both Admins and Employees)
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

      // Try finding the user in Admin collection first
      let user = await Admin.findById(decoded.id).select('-password');
      
      // If not an admin, try finding in Employee collection
      if (!user) {
        user = await Employee.findById(decoded.id).select('-password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized — user not found'
        });
      }

      // Attach user object to request
      req.user = user;
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
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Forbidden — admin access only'
    });
  }
};

module.exports = { protect, adminOnly };
