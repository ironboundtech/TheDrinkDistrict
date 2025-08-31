const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, ROLES } = require('../models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testUsers = [
  {
    name: 'John Doe',
    username: 'john',
    email: 'john@example.com',
    password: 'password123',
    phone: '0812345678',
    role: ROLES.USER,
    isActive: true
  },
  {
    name: 'Jane Smith',
    username: 'jane',
    email: 'jane@example.com',
    password: 'password123',
    phone: '0823456789',
    role: ROLES.USER,
    isActive: true
  },
  {
    name: 'Manager User',
    username: 'manager',
    email: 'manager@example.com',
    password: 'password123',
    phone: '0834567890',
    role: ROLES.MANAGER,
    isActive: true
  }
];

async function createTestUsers() {
  try {
    // Check if users already exist
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ 
        $or: [{ username: userData.username }, { email: userData.email }] 
      });
      
      if (existingUser) {
        console.log(`User ${userData.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Create user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
    }

    console.log('\nTest users created successfully!');
    console.log('You can now test login with:');
    console.log('- Username: john, Password: password123');
    console.log('- Username: jane, Password: password123');
    console.log('- Username: manager, Password: password123');
    console.log('- Username: admin, Password: admin123');

  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nปิดการเชื่อมต่อฐานข้อมูล');
  }
}

createTestUsers();
