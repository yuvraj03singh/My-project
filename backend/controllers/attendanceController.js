const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

// @desc    Get all attendance for admin
// @route   GET /api/attendance
// @access  Admin
const getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('employee', 'fullName employeeId role department')
      .sort({ date: -1, loginTime: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    console.error('Fetch attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance'
    });
  }
};

// @desc    Get current employee's attendance
// @route   GET /api/attendance/me
// @access  Employee
const getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ employee: req.user._id })
      .sort({ date: -1 });

    res.json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Manual Clock-In
// @route   POST /api/attendance/clock-in
// @access  Employee
const clockIn = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if record already exists for today
    const existingEntry = await Attendance.findOne({
      employee: req.user._id,
      date: today
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked in for today.'
      });
    }

    // Determine status (Late after 09:30 AM)
    const threshold = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 30);
    const status = now > threshold ? 'Late' : 'Present';

    const newAttendance = await Attendance.create({
      employee: req.user._id,
      date: today,
      loginTime: now,
      status: status
    });

    res.status(201).json({
      success: true,
      data: newAttendance
    });
  } catch (error) {
    console.error('Clock-in error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clock-in'
    });
  }
};

module.exports = {
  getAllAttendance,
  getMyAttendance,
  clockIn
};
