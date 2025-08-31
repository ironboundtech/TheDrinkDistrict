const mongoose = require('mongoose');
const Product = require('../models/Product');
const { User } = require('../models/User');
require('dotenv').config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sportsbooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sampleProducts = [
  {
    name: 'น้ำดื่มแร่ธรรมชาติ',
    category: 'เครื่องดื่ม',
    price: 25,
    description: 'น้ำดื่มแร่ธรรมชาติ 500ml สดชื่น ดีต่อสุขภาพ',
    stock: 100,
    isActive: true
  },
  {
    name: 'น้ำอัดลมโค้ก',
    category: 'เครื่องดื่ม',
    price: 35,
    description: 'น้ำอัดลมโค้ก 330ml รสชาติเย็นชื่นใจ',
    stock: 50,
    isActive: true
  },
  {
    name: 'ขนมขบเคี้ยว',
    category: 'อาหารว่าง',
    price: 20,
    description: 'ขนมขบเคี้ยวกรอบอร่อย 50g',
    stock: 75,
    isActive: true
  },
  {
    name: 'เสื้อกีฬา District Sports',
    category: 'เสื้อผ้า',
    price: 450,
    description: 'เสื้อกีฬาคุณภาพสูง ระบายอากาศดี',
    stock: 30,
    isActive: true
  },
  {
    name: 'กางเกงกีฬา',
    category: 'เสื้อผ้า',
    price: 380,
    description: 'กางเกงกีฬาสวมใส่สบาย เนื้อผ้าคุณภาพดี',
    stock: 25,
    isActive: true
  },
  {
    name: 'รองเท้ากีฬา',
    category: 'รองเท้า',
    price: 1200,
    description: 'รองเท้ากีฬาเบา นุ่ม สวมใส่สบาย',
    stock: 15,
    isActive: true
  },
  {
    name: 'ลูกเทนนิส',
    category: 'อุปกรณ์กีฬา',
    price: 80,
    description: 'ลูกเทนนิสคุณภาพสูง ใช้ได้นาน',
    stock: 40,
    isActive: true
  },
  {
    name: 'ไม้เทนนิส',
    category: 'อุปกรณ์กีฬา',
    price: 2500,
    description: 'ไม้เทนนิสมืออาชีพ น้ำหนักเบา',
    stock: 10,
    isActive: true
  },
  {
    name: 'แพ็คเกจ 5 ครั้ง',
    category: 'แพ็คเกจ',
    price: 1800,
    description: 'แพ็คเกจจองสนาม 5 ครั้ง พร้อมส่วนลด 10%',
    stock: 20,
    isActive: true
  },
  {
    name: 'แพ็คเกจ 10 ครั้ง',
    category: 'แพ็คเกจ',
    price: 3200,
    description: 'แพ็คเกจจองสนาม 10 ครั้ง พร้อมส่วนลด 15%',
    stock: 15,
    isActive: true
  }
];

async function createSampleProducts() {
  try {
    // Find admin user
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('ไม่พบผู้ดูแลระบบ กำลังสร้างผู้ดูแลระบบใหม่...');
      // Create a simple admin user
      adminUser = new User({
        name: 'System Administrator',
        username: 'admin',
        email: 'admin@77.com',
        password: 'admin123', // This should be hashed in production
        phone: '0812345678',
        role: 'admin',
        isActive: true
      });
      await adminUser.save();
      console.log('สร้างผู้ดูแลระบบสำเร็จ');
    }
    if (!adminUser) {
      console.error('ไม่พบผู้ดูแลระบบ กรุณาสร้างผู้ดูแลระบบก่อน');
      process.exit(1);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('ลบข้อมูลสินค้าเดิมแล้ว');

    // Create sample products
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: adminUser._id
    }));

    await Product.insertMany(productsWithCreator);
    console.log(`สร้างสินค้าตัวอย่าง ${sampleProducts.length} รายการสำเร็จ`);

    // Display created products
    const createdProducts = await Product.find().populate('createdBy', 'firstName lastName');
    console.log('\nสินค้าที่สร้าง:');
    createdProducts.forEach(product => {
      console.log(`- ${product.name} (${product.category}) - ฿${product.price}`);
    });

  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  } finally {
    mongoose.connection.close();
    console.log('\nปิดการเชื่อมต่อฐานข้อมูล');
  }
}

createSampleProducts();
