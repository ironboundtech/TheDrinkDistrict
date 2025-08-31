const mongoose = require('mongoose');
const { User } = require('../models/User');

// Connect to database
mongoose.connect('mongodb://127.0.0.1:27017/sportsbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function resetWalletBalance() {
  try {
    console.log('กำลังรีเซ็ต wallet balance ของ users ทั้งหมด...');
    
    // Update all users to have walletBalance = 0
    const result = await User.updateMany(
      {}, // update all documents
      { walletBalance: 0 }
    );
    
    console.log(`✅ รีเซ็ต wallet balance ของ ${result.modifiedCount} users เป็น 0 บาทแล้ว`);
    
    // Verify the changes
    const users = await User.find({}, 'username email walletBalance');
    console.log('\nรายการ users และ wallet balance ปัจจุบัน:');
    users.forEach(user => {
      console.log(`- ${user.username} (${user.email}): ฿${user.walletBalance}`);
    });
    
    console.log('\n✅ รีเซ็ต wallet balance เสร็จสิ้น!');
    console.log('ตอนนี้ account ใหม่จะเริ่มต้นด้วย 0 บาทเสมอ');

  } catch (error) {
    console.error('Error resetting wallet balance:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nปิดการเชื่อมต่อฐานข้อมูล');
  }
}

resetWalletBalance();
