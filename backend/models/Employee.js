const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    unique: true,
    trim: true,
    uppercase: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  role: {
    type: String,
    trim: true,
    default: 'Employee'
  },
  department: {
    type: String,
    trim: true,
    default: 'General'
  },
  profileImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Auto-generate employeeId and hash password before saving
employeeSchema.pre('save', async function (next) {
  if (!this.employeeId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.employeeId = `EMP-${String(count + 1).padStart(4, '0')}`;
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

// Compare entered password with hashed password
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema);
