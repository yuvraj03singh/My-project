const mongoose = require('mongoose');
require('dotenv').config();

// Models
const Admin = require('./models/Admin');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');

const OLD_MONGO_URI = process.env.OLD_MONGO_URI; // Set this in .env
const NEW_MONGO_URI = process.env.MONGO_URI; // Your new database URI

let oldConnection;
let newConnection;

const migrateData = async () => {
  try {
    console.log('🔄 Starting data migration...\n');

    // Connect to old database
    if (!OLD_MONGO_URI) {
      throw new Error('OLD_MONGO_URI not found in .env file. Please add your old MongoDB connection string.');
    }

    console.log('📡 Connecting to old database...');
    oldConnection = await mongoose.createConnection(OLD_MONGO_URI).asPromise();
    console.log('✅ Connected to old database\n');

    // Connect to new database
    console.log('📡 Connecting to new database...');
    newConnection = await mongoose.createConnection(NEW_MONGO_URI).asPromise();
    console.log('✅ Connected to new database\n');

    // Get models from old connection
    const OldAdmin = oldConnection.model('Admin', require('./models/Admin').schema);
    const OldEmployee = oldConnection.model('Employee', require('./models/Employee').schema);
    const OldAttendance = oldConnection.model('Attendance', require('./models/Attendance').schema);

    // Get models from new connection
    const NewAdmin = newConnection.model('Admin', require('./models/Admin').schema);
    const NewEmployee = newConnection.model('Employee', require('./models/Employee').schema);
    const NewAttendance = newConnection.model('Attendance', require('./models/Attendance').schema);

    // Migrate Admins
    console.log('📋 Migrating Admins...');
    const admins = await OldAdmin.find();
    if (admins.length > 0) {
      const adminDocs = admins.map(admin => ({
        ...admin.toObject(),
        _id: admin._id
      }));
      await NewAdmin.insertMany(adminDocs);
      console.log(`✅ Migrated ${admins.length} admin(s)\n`);
    } else {
      console.log('ℹ️  No admins to migrate\n');
    }

    // Migrate Employees
    console.log('👥 Migrating Employees...');
    const employees = await OldEmployee.find();
    if (employees.length > 0) {
      const employeeDocs = employees.map(emp => ({
        ...emp.toObject(),
        _id: emp._id
      }));
      await NewEmployee.insertMany(employeeDocs);
      console.log(`✅ Migrated ${employees.length} employee(s)\n`);
    } else {
      console.log('ℹ️  No employees to migrate\n');
    }

    // Migrate Attendance
    console.log('📅 Migrating Attendance records...');
    const attendances = await OldAttendance.find();
    if (attendances.length > 0) {
      const attendanceDocs = attendances.map(att => ({
        ...att.toObject(),
        _id: att._id
      }));
      await NewAttendance.insertMany(attendanceDocs);
      console.log(`✅ Migrated ${attendances.length} attendance record(s)\n`);
    } else {
      console.log('ℹ️  No attendance records to migrate\n');
    }

    console.log('✨ Data migration completed successfully!\n');
    
    // Verification
    console.log('📊 Verification:');
    const newAdminCount = await NewAdmin.countDocuments();
    const newEmployeeCount = await NewEmployee.countDocuments();
    const newAttendanceCount = await NewAttendance.countDocuments();
    
    console.log(`   - New Admins: ${newAdminCount}`);
    console.log(`   - New Employees: ${newEmployeeCount}`);
    console.log(`   - New Attendance Records: ${newAttendanceCount}\n`);

  } catch (error) {
    console.error('❌ Migration Error:', error.message);
    process.exit(1);
  } finally {
    // Close connections
    if (oldConnection) await oldConnection.close();
    if (newConnection) await newConnection.close();
    console.log('🔌 Database connections closed');
    process.exit(0);
  }
};

// Run migration
migrateData();
