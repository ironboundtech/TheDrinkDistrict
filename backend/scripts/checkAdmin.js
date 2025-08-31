const mongoose = require('mongoose');
const { User } = require('../models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkAdmin() {
  try {
    const admins = await User.find({ role: 'admin' });
    console.log('Admin users found:', admins.length);
    admins.forEach(admin => {
      console.log(`- Username: ${admin.username}, Email: ${admin.email}, Role: ${admin.role}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkAdmin();
