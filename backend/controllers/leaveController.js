const LeaveRequest = require('../models/LeaveRequest');
const Employee = require('../models/Employee');
const Notification = require('../models/Notification');

// @desc    Create a new leave request
// @route   POST /api/leave
// @access  Employee
const createLeaveRequest = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason, attachmentUrl } = req.body;
    const employeeId = req.user._id;

    // Validate required fields
    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide leaveType, startDate, endDate, and reason'
      });
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      });
    }

    // Get employee details
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Create leave request
    const leaveRequest = new LeaveRequest({
      employee: employeeId,
      leaveType,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      attachmentUrl: attachmentUrl || ''
    });

    await leaveRequest.save();

    // Populate employee details for response
    await leaveRequest.populate('employee', 'fullName employeeId email department');

    // Create admin notification about new leave request
    try {
      await Notification.create({
        recipientRole: 'admin',
        type: 'leave_request',
        message: `${employee.fullName} submitted a leave request (${leaveRequest.leaveType})`,
        data: { leaveId: leaveRequest._id, employeeId: employee._id }
      });
    } catch (notifErr) {
      console.error('Notification create error:', notifErr);
      // Do not block leave creation on notification failure
    }

    res.status(201).json({
      success: true,
      message: 'Leave request submitted successfully',
      data: leaveRequest
    });
  } catch (error) {
    console.error('Leave creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating leave request'
    });
  }
};

// @desc    Get all leave requests for current employee
// @route   GET /api/leave/my-requests
// @access  Employee
const getMyLeaveRequests = async (req, res) => {
  try {
    const employeeId = req.user._id;
    const { status } = req.query;

    const query = { employee: employeeId };

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    const leaveRequests = await LeaveRequest.find(query)
      .populate('employee', 'fullName employeeId email department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: leaveRequests,
      count: leaveRequests.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leave requests'
    });
  }
};

// @desc    Get all leave requests (Admin only)
// @route   GET /api/leave
// @access  Admin
const getAllLeaveRequests = async (req, res) => {
  try {
    const { status, employeeId, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (employeeId) {
      query.employee = employeeId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const leaveRequests = await LeaveRequest.find(query)
      .populate('employee', 'fullName employeeId email department')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await LeaveRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: leaveRequests,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leave requests'
    });
  }
};

// @desc    Approve a leave request (Admin only)
// @route   PATCH /api/leave/:leaveId/approve
// @access  Admin
const approveLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const adminId = req.user._id;

    const leaveRequest = await LeaveRequest.findById(leaveId);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve a ${leaveRequest.status.toLowerCase()} leave request`
      });
    }

    // Update leave request
    leaveRequest.status = 'Approved';
    leaveRequest.approvedBy = adminId;
    await leaveRequest.save();

    // Populate details for response
    await leaveRequest.populate('employee', 'fullName employeeId email department');
    await leaveRequest.populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Leave request approved successfully',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error approving leave request'
    });
  }
};

// @desc    Reject a leave request (Admin only)
// @route   PATCH /api/leave/:leaveId/reject
// @access  Admin
const rejectLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.user._id;

    const leaveRequest = await LeaveRequest.findById(leaveId);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    if (leaveRequest.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject a ${leaveRequest.status.toLowerCase()} leave request`
      });
    }

    // Update leave request
    leaveRequest.status = 'Rejected';
    leaveRequest.approvedBy = adminId;
    leaveRequest.rejectionReason = rejectionReason || 'No reason provided';
    await leaveRequest.save();

    // Populate details for response
    await leaveRequest.populate('employee', 'fullName employeeId email department');
    await leaveRequest.populate('approvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Leave request rejected successfully',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error rejecting leave request'
    });
  }
};

// @desc    Get leave request by ID
// @route   GET /api/leave/:leaveId
// @access  Employee/Admin
const getLeaveRequestById = async (req, res) => {
  try {
    const { leaveId } = req.params;

    const leaveRequest = await LeaveRequest.findById(leaveId)
      .populate('employee', 'fullName employeeId email department')
      .populate('approvedBy', 'name email');

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching leave request'
    });
  }
};

// @desc    Cancel a leave request (Employee only)
// @route   PATCH /api/leave/:leaveId/cancel
// @access  Employee
const cancelLeaveRequest = async (req, res) => {
  try {
    const { leaveId } = req.params;
    const employeeId = req.user._id;

    const leaveRequest = await LeaveRequest.findById(leaveId);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: 'Leave request not found'
      });
    }

    // Verify it's the employee's request
    if (leaveRequest.employee.toString() !== employeeId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this leave request'
      });
    }

    if (leaveRequest.status !== 'Pending' && leaveRequest.status !== 'Approved') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${leaveRequest.status.toLowerCase()} leave request`
      });
    }

    leaveRequest.status = 'Cancelled';
    await leaveRequest.save();

    res.status(200).json({
      success: true,
      message: 'Leave request cancelled successfully',
      data: leaveRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling leave request'
    });
  }
};

module.exports = {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  getLeaveRequestById,
  cancelLeaveRequest
};
