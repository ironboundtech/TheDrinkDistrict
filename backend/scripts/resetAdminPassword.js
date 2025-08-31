const connectDB = require('../config/database');
const { User } = require('../models/User');
const bcrypt = require('bcryptjs');

const resetAdminPassword = async () => {
  try {
    // Connect to database
    await connectDB();

    // Find admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    // Hash new password
    const saltRounds = 10;
    const newPassword = 'admin123'; // Simple password for testing
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update admin password
    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log('✅ Admin password reset successfully:', {
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role,
      newPassword: newPassword
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting admin password:', error);
    process.exit(1);
  }
};

resetAdminPassword();
