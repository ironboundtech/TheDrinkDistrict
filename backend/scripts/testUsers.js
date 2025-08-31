const connectDB = require('../config/database');
const { User } = require('../models/User');

const listUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    // Get all users (excluding passwords)
    const users = await User.find({}, '-password').sort({ createdAt: 1 });

    console.log('📊 Users in MongoDB:');
    console.log(`Total users: ${users.length}`);
    console.log('-------------------');

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Username: ${user.username || 'Not set'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone: ${user.phone || 'Not provided'}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('-------------------');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error listing users:', error);
    process.exit(1);
  }
};

listUsers();
