const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin, getMe } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginAdmin);
router.post('/register', registerAdmin);

// Protected routes
router.get('/me', protect, adminOnly, getMe);

module.exports = router;
