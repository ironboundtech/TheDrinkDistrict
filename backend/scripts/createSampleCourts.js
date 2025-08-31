const connectDB = require('../config/database');
const Court = require('../models/Court');

const createSampleCourts = async () => {
  try {
    await connectDB();
    
    // Check if courts already exist
    const existingCourts = await Court.find();
    if (existingCourts.length > 0) {
      console.log('✅ Sample courts already exist!');
      console.log(`📊 Total courts: ${existingCourts.length}`);
      existingCourts.forEach(court => {
        console.log(`   - ${court.name} (${court.venue}) - ฿${court.price}/hr - ${court.status}`);
      });
      process.exit(0);
    }

    const sampleCourts = [
      {
        name: 'Court 1',
        address: 'Sukhumvit Road, Bangkok',
        price: 400,
        venue: 'District Sports Sukhumvit',
        amenities: ['Air Conditioning', 'Parking', 'Locker Room'],
        status: 'open',
        image: 'http://localhost:5001/api/placeholder/300/200'
      },
      {
        name: 'Court 2',
        address: 'Sukhumvit Road, Bangkok',
        price: 400,
        venue: 'District Sports Sukhumvit',
        amenities: ['Air Conditioning', 'Parking', 'Locker Room'],
        status: 'open',
        image: 'http://localhost:5001/api/placeholder/300/200'
      },
      {
        name: 'Court 3',
        address: 'Sukhumvit Road, Bangkok',
        price: 400,
        venue: 'District Sports Sukhumvit',
        amenities: ['Air Conditioning', 'Parking', 'Locker Room'],
        status: 'closed',
        image: 'http://localhost:5001/api/placeholder/300/200'
      },
      {
        name: 'Court 1',
        address: 'Thonglor District, Bangkok',
        price: 500,
        venue: 'District Sports Thonglor',
        amenities: ['Premium Courts', 'Pro Shop', 'Restaurant'],
        status: 'open',
        image: 'http://localhost:5001/api/placeholder/300/200'
      },
      {
        name: 'Court 2',
        address: 'Thonglor District, Bangkok',
        price: 500,
        venue: 'District Sports Thonglor',
        amenities: ['Premium Courts', 'Pro Shop', 'Restaurant'],
        status: 'open',
        image: 'http://localhost:5001/api/placeholder/300/200'
      },
      {
        name: 'Court 1',
        address: 'Silom Road, Bangkok',
        price: 350,
        venue: 'District Sports Silom',
        amenities: ['City View', 'Equipment Rental', 'Shower'],
        status: 'open',
        image: 'http://localhost:5001/api/placeholder/300/200'
      }
    ];

    await Court.insertMany(sampleCourts);
    
    console.log('✅ Sample courts created successfully!');
    console.log(`📊 Total courts created: ${sampleCourts.length}`);
    sampleCourts.forEach(court => {
      console.log(`   - ${court.name} (${court.venue}) - ฿${court.price}/hr - ${court.status}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating sample courts:', error);
    process.exit(1);
  }
};

createSampleCourts();
