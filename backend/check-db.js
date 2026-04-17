const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

const checkAndSetupData = async () => {
  try {
    console.log('🔍 Checking database connection...\n');
    
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database\n');

    // Check collections
    const adminCount = await Admin.countDocuments();
    const employeeCount = await Employee.countDocuments();
    const attendanceCount = await Attendance.countDocuments();

    console.log('📊 Current Database Status:');
    console.log(`   - Admins: ${adminCount}`);
    console.log(`   - Employees: ${employeeCount}`);
    console.log(`   - Attendance Records: ${attendanceCount}\n`);

    // List all admins
    if (adminCount > 0) {
      const admins = await Admin.find().select('-password');
      console.log('📋 Existing Admins:');
      admins.forEach((admin, idx) => {
        console.log(`   ${idx + 1}. ${admin.adminId} - ${admin.name} (${admin.email})`);
      });
      console.log();
    } else {
      console.log('⚠️  No admins found in database!\n');
    }

    // If no admins, create one
    if (adminCount === 0) {
      console.log('🆕 Creating default admin...');
      const defaultAdmin = await Admin.create({
        adminId: 'ADM-001',
        name: 'Admin User',
        email: 'admin@studiocore.com',
        password: 'Admin@123'
      });
      console.log(`✅ Created admin: ADM-001 (Password: Admin@123)\n`);
    }

    // List all employees
    if (employeeCount > 0) {
      const employees = await Employee.find().select('-password').limit(5);
      console.log(`👥 First 5 Employees (Total: ${employeeCount}):`);
      employees.forEach((emp, idx) => {
        console.log(`   ${idx + 1}. ${emp.employeeId} - ${emp.fullName}`);
      });
      console.log();
    } else {
      console.log('ℹ️  No employees in database\n');
    }

    console.log('✨ Setup check completed!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

checkAndSetupData();
