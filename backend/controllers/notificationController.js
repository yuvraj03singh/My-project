const Notification = require('../models/Notification');

// @desc Get notifications for the authenticated user (role-scoped)
// @route GET /api/notifications
// @access Admin/Employee
const getNotifications = async (req, res) => {
  try {
    // If admin, fetch admin-scoped notifications
    const role = req.user.role || 'employee';

    const query = {};
    if (role === 'admin') {
      query.recipientRole = 'admin';
    } else {
      query.$or = [
        { recipientRole: role },
        { recipientId: req.user._id }
      ];
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching notifications' });
  }
};

// @desc Mark a notification as read
// @route PATCH /api/notifications/:id/read
// @access Admin/Employee
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findById(id);
    if (!notif) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notif.read = true;
    await notif.save();

    res.status(200).json({ success: true, data: notif });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getNotifications, markAsRead };
