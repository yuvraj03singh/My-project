const express = require('express');
const router = express.Router();
const { getAllAttendance, getMyAttendance, clockIn } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/attendance
// @desc    Get all attendance records (Admin only)
router.get('/', protect, adminOnly, getAllAttendance);

// @route   GET /api/attendance/me
// @desc    Get current employee's attendance records
router.get('/me', protect, getMyAttendance);

// @route   POST /api/attendance/clock-in
// @desc    Employee clock-in
router.post('/clock-in', protect, clockIn);

module.exports = router;
