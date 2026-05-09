const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipientRole: {
    type: String,
    enum: ['admin', 'employee', 'manager'],
    default: 'admin'
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'recipientModel',
    required: false
  },
  recipientModel: {
    type: String,
    enum: ['Admin', 'Employee'],
    required: false
  },
  type: {
    type: String,
    default: 'general'
  },
  message: {
    type: String,
    required: true
  },
  data: {
    type: Object,
    default: {}
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
