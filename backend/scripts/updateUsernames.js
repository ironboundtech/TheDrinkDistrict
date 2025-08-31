const connectDB = require('../config/database');
const { User } = require('../models/User');

const updateUsernames = async () => {
  try {
    // Connect to database
    await connectDB();

    // Find users without username
    const usersWithoutUsername = await User.find({ username: { $exists: false } });
    
    if (usersWithoutUsername.length === 0) {
      console.log('✅ All users already have usernames!');
      process.exit(0);
    }

    console.log(`🔄 Found ${usersWithoutUsername.length} users without username:`);
    
    for (let i = 0; i < usersWithoutUsername.length; i++) {
      const user = usersWithoutUsername[i];
      
      // Generate username from email (remove @domain.com)
      const emailUsername = user.email.split('@')[0];
      
      // Check if username already exists
      let username = emailUsername;
      let counter = 1;
      
      while (await User.findOne({ username: username })) {
        username = `${emailUsername}${counter}`;
        counter++;
      }
      
      // Update user with username
      user.username = username;
      await user.save();
      
      console.log(`   ${i + 1}. ${user.name} (${user.email}) -> username: ${username}`);
    }

    console.log('✅ All users updated with usernames!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating usernames:', error);
    process.exit(1);
  }
};

updateUsernames();
