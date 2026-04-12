const Employee = require('../models/Employee');

// @desc    Create new employee
// @route   POST /api/employees
// @access  Admin only
const createEmployee = async (req, res) => {
  try {
    const { fullName, email, phone, role, department, profileImage, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    // Check if employee with this email already exists
    const existingEmployee = await Employee.findOne({ email: email.toLowerCase() });
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email already exists'
      });
    }

    const employee = await Employee.create({
      fullName,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: role || 'Employee',
      department: department || 'General',
      profileImage: profileImage || ''
    });

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating employee'
    });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Admin only
const getAllEmployees = async (req, res) => {
  try {
    const { search, department, status, page = 1, limit = 50 } = req.query;

    // Build filter
    let filter = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }

    const total = await Employee.countDocuments(filter);
    const employees = await Employee.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: employees.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: employees
    });
  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employees'
    });
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Admin only
const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
        { employeeId: req.params.id.toUpperCase() }
      ].filter(Boolean)
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Get employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching employee'
    });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Admin only
const updateEmployee = async (req, res) => {
  try {
    const { fullName, email, phone, role, department, status, profileImage } = req.body;

    let employee = await Employee.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
        { employeeId: req.params.id.toUpperCase() }
      ].filter(Boolean)
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Update fields
    if (fullName !== undefined) employee.fullName = fullName;
    if (email !== undefined) employee.email = email.toLowerCase();
    if (phone !== undefined) employee.phone = phone;
    if (role !== undefined) employee.role = role;
    if (department !== undefined) employee.department = department;
    if (status !== undefined) employee.status = status;
    if (profileImage !== undefined) employee.profileImage = profileImage;

    await employee.save();

    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating employee'
    });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Admin only
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : undefined },
        { employeeId: req.params.id.toUpperCase() }
      ].filter(Boolean)
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await Employee.deleteOne({ _id: employee._id });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting employee'
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee
};
