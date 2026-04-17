const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  loginTime: {
    type: Date,
    required: true
  },
  logoutTime: {
    type: Date
  },
  logoutStatus: {
    type: String,
    enum: [null, 'early', 'ontime', 'overtime'],
    default: null
  },
  overtimeHours: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent'],
    default: 'Present'
  }
}, {
  timestamps: true
});

// Index to quickly check if employee already has attendance for a specific date
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
