const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Admin ID and password'
      });
    }
    let user;
    let role;

    // Check prefix
    if (adminId.toUpperCase().startsWith('EMP-')) {
      user = await Employee.findOne({ employeeId: adminId.toUpperCase() });
      role = 'Employee';
    } else {
      user = await Admin.findOne({ adminId: adminId.toUpperCase() });
      role = 'admin';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid ID or password'
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid ID or password'
      });
    }

    // --- UNIFIED LOGIN RESPONSE ---

    // Generate token and return data
    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        _id: user._id,
        adminId: role === 'admin' ? user.adminId : user.employeeId,
        name: role === 'admin' ? user.name : user.fullName,
        email: user.email,
        role: role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Register new admin
// @route   POST /api/auth/register
// @access  Public (one-time setup)
const registerAdmin = async (req, res) => {
  try {
    const { adminId, name, email, password } = req.body;

    if (!adminId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if admin ID starts with ADM- or SC-
    const upperAdminId = adminId.toUpperCase();
    if (!upperAdminId.startsWith('ADM-') && !upperAdminId.startsWith('SC-')) {
      return res.status(400).json({
        success: false,
        message: 'Admin ID must start with ADM- or SC-'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ adminId: upperAdminId }, { email: email.toLowerCase() }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this ID or email already exists'
      });
    }

    // Create admin
    const admin = await Admin.create({
      adminId: upperAdminId,
      name,
      email: email.toLowerCase(),
      password
    });

    const token = generateToken(admin._id);

    res.status(201).json({
      success: true,
      data: {
        _id: admin._id,
        adminId: admin.adminId,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Admin (protected)
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { loginAdmin, registerAdmin, getMe };
