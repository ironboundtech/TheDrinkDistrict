const connectDB = require('../config/database');
const { User, ROLES } = require('../models/User');
const bcrypt = require('bcryptjs');

const createAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: ROLES.ADMIN });
    if (existingAdmin) {
      console.log('🔄 Found existing admin user, updating with username...');
      
      // Update existing admin with username
      existingAdmin.username = 'admin';
      await existingAdmin.save();
      
      console.log('✅ Admin user updated successfully:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      process.exit(0);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('admin123', saltRounds);

    // Create admin user
    const adminUser = new User({
      name: 'System Administrator',
      username: 'admin',
      email: 'admin@sportsbooking.com',
      password: hashedPassword,
      phone: '0812345678',
      role: ROLES.ADMIN,
      isActive: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      password: 'admin123' // Show the plain password for initial setup
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
