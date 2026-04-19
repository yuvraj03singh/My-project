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

// @desc    Get employee attendance statistics with percentage
// @route   GET /api/attendance/stats/me
// @access  Employee
const getMyAttendanceStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get first day of current month
    const monthStart = new Date(currentYear, currentMonth, 1);
    // Get today - set to start of day
    const today = new Date(currentYear, currentMonth, now.getDate());
    // Get tomorrow - to include all of today's records
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch all attendance records for the employee in current month
    const attendanceRecords = await Attendance.find({
      employee: req.user._id,
      date: {
        $gte: monthStart,
        $lt: tomorrow
      }
    }).sort({ date: 1 });

    // Calculate working days (Mon-Fri only, no weekends)
    let workingDays = 0;
    let currentDate = new Date(monthStart);

    while (currentDate <= today) {
      const dayOfWeek = currentDate.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count present days (including Late status)
    const presentDays = attendanceRecords.filter(
      record => record.status === 'Present' || record.status === 'Late'
    ).length;

    // Count absent days
    const absentDays = attendanceRecords.filter(
      record => record.status === 'Absent'
    ).length;

    // Count late arrivals
    const lateCount = attendanceRecords.filter(
      record => record.status === 'Late'
    ).length;

    // Calculate attendance percentage
    const attendancePercentage = workingDays > 0 
      ? ((presentDays / workingDays) * 100).toFixed(2)
      : 0;

    // Create attendance map for calendar
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      attendanceMap[dateKey] = {
        status: record.status,
        loginTime: record.loginTime,
        logoutTime: record.logoutTime,
        overtimeHours: record.overtimeHours
      };
    });

    res.json({
      success: true,
      data: {
        totalWorkingDays: workingDays,
        presentDays: presentDays,
        absentDays: absentDays,
        lateCount: lateCount,
        attendancePercentage: parseFloat(attendancePercentage),
        currentMonth: new Date(currentYear, currentMonth).toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        }),
        attendanceRecords: attendanceRecords,
        attendanceMap: attendanceMap
      }
    });
  } catch (error) {
    console.error('Get attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance statistics'
    });
  }
};

// @desc    Get attendance statistics for a specific month and year
// @route   GET /api/attendance/stats/month/:year/:month
// @access  Employee
const getMonthAttendanceStats = async (req, res) => {
  try {
    const { year, month } = req.params;
    const year_num = parseInt(year);
    const month_num = parseInt(month) - 1; // Convert to 0-indexed

    // Validate inputs
    if (isNaN(year_num) || isNaN(month_num) || month_num < 0 || month_num > 11) {
      return res.status(400).json({
        success: false,
        message: 'Invalid year or month'
      });
    }

    const monthStart = new Date(year_num, month_num, 1);
    const monthEnd = new Date(year_num, month_num + 1, 0);
    
    // Add one day to monthEnd to include all records for the last day of month
    const nextDay = new Date(monthEnd);
    nextDay.setDate(nextDay.getDate() + 1);

    // Fetch all attendance records for the employee in specified month
    const attendanceRecords = await Attendance.find({
      employee: req.user._id,
      date: {
        $gte: monthStart,
        $lt: nextDay
      }
    }).sort({ date: 1 });

    // Calculate working days (Mon-Fri only, no weekends)
    let workingDays = 0;
    let currentDate = new Date(monthStart);

    while (currentDate <= monthEnd) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count present days
    const presentDays = attendanceRecords.filter(
      record => record.status === 'Present' || record.status === 'Late'
    ).length;

    // Count absent days
    const absentDays = attendanceRecords.filter(
      record => record.status === 'Absent'
    ).length;

    // Count late arrivals
    const lateCount = attendanceRecords.filter(
      record => record.status === 'Late'
    ).length;

    // Calculate attendance percentage
    const attendancePercentage = workingDays > 0 
      ? ((presentDays / workingDays) * 100).toFixed(2)
      : 0;

    // Create attendance map for calendar
    const attendanceMap = {};
    attendanceRecords.forEach(record => {
      const dateKey = new Date(record.date).toISOString().split('T')[0];
      attendanceMap[dateKey] = {
        status: record.status,
        loginTime: record.loginTime,
        logoutTime: record.logoutTime,
        overtimeHours: record.overtimeHours
      };
    });

    res.json({
      success: true,
      data: {
        totalWorkingDays: workingDays,
        presentDays: presentDays,
        absentDays: absentDays,
        lateCount: lateCount,
        attendancePercentage: parseFloat(attendancePercentage),
        month: new Date(year_num, month_num).toLocaleString('default', {
          month: 'long',
          year: 'numeric'
        }),
        attendanceRecords: attendanceRecords,
        attendanceMap: attendanceMap
      }
    });
  } catch (error) {
    console.error('Get month attendance stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching attendance statistics'
    });
  }
};

module.exports = {
  getAllAttendance,
  getMyAttendance,
  clockIn,
  clockOut,
  getDashboardStats,
  getMyAttendanceStats,
  getMonthAttendanceStats
};
