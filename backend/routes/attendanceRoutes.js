const express = require('express');
const router = express.Router();
const { 
  getAllAttendance, 
  getMyAttendance, 
  clockIn, 
  clockOut, 
  getDashboardStats,
  getMyAttendanceStats,
  getMonthAttendanceStats
} = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/attendance
// @desc    Get all attendance records (Admin only)
router.get('/', protect, adminOnly, getAllAttendance);

// @route   GET /api/attendance/me
// @desc    Get current employee's attendance records
router.get('/me', protect, getMyAttendance);

// @route   GET /api/attendance/stats
// @desc    Get attendance stats for dashboard (Admin)
router.get('/stats', protect, adminOnly, getDashboardStats);

// @route   GET /api/attendance/stats/me
// @desc    Get current employee's attendance statistics with percentage
router.get('/stats/me', protect, getMyAttendanceStats);

// @route   GET /api/attendance/stats/month/:year/:month
// @desc    Get attendance statistics for a specific month
router.get('/stats/month/:year/:month', protect, getMonthAttendanceStats);

// @route   POST /api/attendance/clock-in
// @desc    Employee clock-in
router.post('/clock-in', protect, clockIn);

// @route   POST /api/attendance/clock-out
// @desc    Employee clock-out
router.post('/clock-out', protect, clockOut);

module.exports = router;
