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

// @desc    Manual Clock-Out
// @route   POST /api/attendance/clock-out
// @access  Employee
const clockOut = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Find today's attendance record
    const attendanceRecord = await Attendance.findOne({
      employee: req.user._id,
      date: today
    });

    if (!attendanceRecord) {
      return res.status(400).json({
        success: false,
        message: 'No clock-in record found for today. Please clock in first.'
      });
    }

    if (attendanceRecord.logoutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already clocked out for today.'
      });
    }

    // Set logout time
    attendanceRecord.logoutTime = now;

    // Determine logout status (based on 5 PM = 17:00)
    const logoutHour = now.getHours();
    const logoutMinute = now.getMinutes();
    const workEndTime = 17; // 5 PM

    if (logoutHour < workEndTime) {
      attendanceRecord.logoutStatus = 'early';
      attendanceRecord.overtimeHours = 0;
    } else if (logoutHour === workEndTime && logoutMinute <= 0) {
      attendanceRecord.logoutStatus = 'ontime';
      attendanceRecord.overtimeHours = 0;
    } else {
      attendanceRecord.logoutStatus = 'overtime';
      const overtimeMinutes = (logoutHour - workEndTime) * 60 + logoutMinute;
      attendanceRecord.overtimeHours = Math.round(overtimeMinutes / 60 * 10) / 10; // Round to nearest 0.1 hour
    }

    await attendanceRecord.save();

    res.json({
      success: true,
      data: attendanceRecord
    });
  } catch (error) {
    console.error('Clock-out error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during clock-out'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/attendance/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalEmployees = await Employee.countDocuments({ status: 'active' });
    const presentToday = await Attendance.countDocuments({
      date: today
    });

    res.json({
      success: true,
      data: {
        total: totalEmployees,
        present: presentToday,
        absent: Math.max(0, totalEmployees - presentToday),
        onLeave: 0
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats'
    });
  }
};

module.exports = {
  getAllAttendance,
  getMyAttendance,
  clockIn,
  clockOut,
  getDashboardStats
};
