const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Check if default admin already exists
    const existingAdmin = await Admin.findOne({ adminId: 'ADM-001' });
    
    if (existingAdmin) {
      console.log('⚠️  Default admin (ADM-001) already exists. Skipping seed.');
    } else {
      await Admin.create({
        adminId: 'ADM-001',
        name: 'Studio Admin',
        email: 'admin@studiocore.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ Default admin created successfully!');
      console.log('   Admin ID: ADM-001');
      console.log('   Password: admin123');
    }

    // Also create a second admin with SC- prefix
    const existingSC = await Admin.findOne({ adminId: 'SC-001' });
    if (!existingSC) {
      await Admin.create({
        adminId: 'SC-001',
        name: 'StudioCore Director',
        email: 'director@studiocore.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('✅ StudioCore admin created successfully!');
      console.log('   Admin ID: SC-001');
      console.log('   Password: admin123');
    }

    await mongoose.disconnect();
    console.log('\n🎉 Seeding complete! You can now start the server.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
