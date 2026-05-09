const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');

// Employee routes
router.post('/', protect, leaveController.createLeaveRequest);
router.get('/my-requests', protect, leaveController.getMyLeaveRequests);
router.get('/:leaveId', protect, leaveController.getLeaveRequestById);
router.patch('/:leaveId/cancel', protect, leaveController.cancelLeaveRequest);

// Admin routes
router.get('/', protect, leaveController.getAllLeaveRequests);
router.patch('/:leaveId/approve', protect, leaveController.approveLeaveRequest);
router.patch('/:leaveId/reject', protect, leaveController.rejectLeaveRequest);

module.exports = router;
