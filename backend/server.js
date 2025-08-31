const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Database connection
const connectDB = require('./config/database');
const { PORT } = require('./config/constants');

// Import models
const Venue = require('./models/Venue');
const { User } = require('./models/User');
const Booking = require('./models/Booking');

// Import routes
const authRoutes = require('./routes/auth');
const courtsRoutes = require('./routes/courts');
const placeholderRoutes = require('./routes/placeholder');
const productsRoutes = require('./routes/products');
const bookingsRoutes = require('./routes/bookings');
const purchasesRoutes = require('./routes/purchases');

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "http://localhost:5001", "https://thedrinkdistrict.onrender.com", "https://via.placeholder.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5173', 
    'http://127.0.0.1:3000', 
    'http://127.0.0.1:5173',
    'https://thedrinkdistrict-f.onrender.com'
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sample data
const venues = [
  {
    id: 1,
    name: 'District Sports Sukhumvit',
    location: 'Sukhumvit Road, Bangkok',
    distance: '2.1 km',
    courts: 4,
    rating: 4.8,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['Air Conditioning', 'Parking', 'Locker Room', 'Cafe'],
    price: 400,
    availableSlots: [
      { time: '09:00-10:00', available: true },
      { time: '10:00-11:00', available: true },
      { time: '11:00-12:00', available: false },
      { time: '12:00-13:00', available: true },
      { time: '13:00-14:00', available: true },
      { time: '14:00-15:00', available: true },
      { time: '15:00-16:00', available: false },
      { time: '16:00-17:00', available: true },
      { time: '17:00-18:00', available: true },
      { time: '18:00-19:00', available: false },
      { time: '19:00-20:00', available: true },
      { time: '20:00-21:00', available: true }
    ]
  },
  {
    id: 2,
    name: 'District Sports Thonglor',
    location: 'Thonglor District, Bangkok',
    distance: '3.7 km',
    courts: 6,
    rating: 4.9,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['Premium Courts', 'Pro Shop', 'Restaurant', 'Parking'],
    price: 500,
    availableSlots: [
      { time: '09:00-10:00', available: true },
      { time: '10:00-11:00', available: true },
      { time: '11:00-12:00', available: true },
      { time: '12:00-13:00', available: false },
      { time: '13:00-14:00', available: true },
      { time: '14:00-15:00', available: true },
      { time: '15:00-16:00', available: true },
      { time: '16:00-17:00', available: true },
      { time: '17:00-18:00', available: false },
      { time: '18:00-19:00', available: true },
      { time: '19:00-20:00', available: true },
      { time: '20:00-21:00', available: true }
    ]
  },
  {
    id: 3,
    name: 'District Sports Silom',
    location: 'Silom Road, Bangkok',
    distance: '5.2 km',
    courts: 3,
    rating: 4.7,
    image: 'https://via.placeholder.com/300x200',
    amenities: ['City View', 'Equipment Rental', 'Shower', 'WiFi'],
    price: 350,
    availableSlots: [
      { time: '09:00-10:00', available: true },
      { time: '10:00-11:00', available: false },
      { time: '11:00-12:00', available: true },
      { time: '12:00-13:00', available: true },
      { time: '13:00-14:00', available: false },
      { time: '14:00-15:00', available: true },
      { time: '15:00-16:00', available: true },
      { time: '16:00-17:00', available: true },
      { time: '17:00-18:00', available: true },
      { time: '18:00-19:00', available: false },
      { time: '19:00-20:00', available: true },
      { time: '20:00-21:00', available: true }
    ]
  }
];

const users = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    level: 'Gold Member',
    avatar: 'https://via.placeholder.com/40x40',
    walletBalance: 1250.00,
    totalBookings: 27,
    totalSpent: 2450,
    rating: 4.9
  }
];

const bookings = [
  {
    id: 1,
    userId: 1,
    venueId: 1,
    venueName: 'District Sports Sukhumvit',
    date: '2024-12-27',
    time: '18:00-19:00',
    court: 'Court 2',
    status: 'active',
    pin: '7294',
    price: 400,
    createdAt: '2024-12-27T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    venueId: 2,
    venueName: 'District Sports Thonglor',
    date: '2024-12-28',
    time: '19:00-20:00',
    court: 'Court 1',
    status: 'upcoming',
    pin: null,
    price: 500,
    createdAt: '2024-12-26T15:30:00Z'
  }
];

const storeItems = [
  {
    id: 1,
    name: 'Energy Smoothie',
    price: 120,
    category: 'Beverages',
    image: 'https://via.placeholder.com/150x150',
    description: 'Fresh fruit smoothie with protein boost',
    inStock: true
  },
  {
    id: 2,
    name: 'District Sports T-Shirt',
    price: 890,
    category: 'Merchandise',
    image: 'https://via.placeholder.com/150x150',
    description: 'Premium cotton sports t-shirt',
    inStock: true
  },
  {
    id: 3,
    name: 'Protein Bar',
    price: 85,
    category: 'Snacks',
    image: 'https://via.placeholder.com/150x150',
    description: 'High-protein energy bar',
    inStock: true
  },
  {
    id: 4,
    name: '5-Session Package',
    price: 1800,
    category: 'Packages',
    image: 'https://via.placeholder.com/150x150',
    description: '5 court booking sessions',
    originalPrice: 2000,
    discount: '10% OFF',
    inStock: true
  }
];

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtsRoutes);
app.use('/api/placeholder', placeholderRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/purchases', purchasesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all venues
app.get('/api/venues', async (req, res) => {
  try {
    const venues = await Venue.find().sort({ createdAt: -1 });
    res.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ error: 'Failed to fetch venues' });
  }
});

// Get venue by ID
app.get('/api/venues/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    console.error('Error fetching venue:', error);
    res.status(500).json({ error: 'Failed to fetch venue' });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user bookings
app.get('/api/users/:id/bookings', async (req, res) => {
  try {
    const userBookings = await Booking.find({ user: req.params.id })
      .populate('venue', 'name location')
      .sort({ createdAt: -1 });
    res.json(userBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Failed to fetch user bookings' });
  }
});

// Create new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { userId, venueId, date, time, court } = req.body;
    
    // Validate required fields
    if (!userId || !venueId || !date || !time || !court) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Check if time slot is available
    const timeSlot = venue.availableSlots.find(slot => slot.time === time);
    if (!timeSlot || !timeSlot.available) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    // Create new booking
    const newBooking = new Booking({
      user: userId,
      venue: venueId,
      date: new Date(date),
      timeSlot: time,
      courtNumber: parseInt(court.replace('Court ', '')),
      totalPrice: venue.price,
      status: 'pending'
    });

    await newBooking.save();
    
    // Mark time slot as unavailable
    timeSlot.available = false;
    await venue.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get store items
app.get('/api/store', (req, res) => {
  const { category } = req.query;
  
  if (category && category !== 'All') {
    const filteredItems = storeItems.filter(item => item.category === category);
    res.json(filteredItems);
  } else {
    res.json(storeItems);
  }
});

// Get store item by ID
app.get('/api/store/:id', (req, res) => {
  const item = storeItems.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.json(item);
});

// Wallet operations
app.get('/api/users/:id/wallet', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ balance: user.walletBalance });
});



// Placeholder image API
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  res.redirect(`https://via.placeholder.com/${width}x${height}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Setup uploads directories
    const fs = require('fs');
    const uploadsDir = path.join(__dirname, 'uploads');
    const courtsDir = path.join(uploadsDir, 'courts');
    const productsDir = path.join(uploadsDir, 'products');
    
    // Create directories if they don't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }
    if (!fs.existsSync(courtsDir)) {
      fs.mkdirSync(courtsDir, { recursive: true });
      console.log('✅ Created uploads/courts directory');
    }
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
      console.log('✅ Created uploads/products directory');
    }
    
    // Connect to MongoDB
    await connectDB();
    
    // Seed initial data if database is empty
    const venueCount = await Venue.countDocuments();
    if (venueCount === 0) {
      await seedInitialData();
      console.log('✅ Initial data seeded successfully');
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Sports Booking Backend running on port ${PORT}`);
      console.log(`📱 Frontend will be available at http://localhost:3000`);
      console.log(`🔌 API available at http://localhost:${PORT}/api`);
      console.log(`🗄️  MongoDB connected successfully`);
      console.log(`📁 Uploads directory: ${uploadsDir}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Seed initial data function
const seedInitialData = async () => {
  try {
    // Create initial venues
    const initialVenues = [
      {
        name: 'District Sports Sukhumvit',
        location: 'Sukhumvit Road, Bangkok',
        distance: '2.1 km',
        courts: 4,
        rating: 4.8,
        image: 'https://via.placeholder.com/300x200',
        amenities: ['Air Conditioning', 'Parking', 'Locker Room', 'Cafe'],
        price: 400,
        availableSlots: [
          { time: '09:00-10:00', available: true },
          { time: '10:00-11:00', available: true },
          { time: '11:00-12:00', available: false },
          { time: '12:00-13:00', available: true },
          { time: '13:00-14:00', available: true },
          { time: '14:00-15:00', available: true },
          { time: '15:00-16:00', available: false },
          { time: '16:00-17:00', available: true },
          { time: '17:00-18:00', available: true },
          { time: '18:00-19:00', available: false },
          { time: '19:00-20:00', available: true },
          { time: '20:00-21:00', available: true }
        ]
      },
      {
        name: 'District Sports Thonglor',
        location: 'Thonglor District, Bangkok',
        distance: '3.7 km',
        courts: 6,
        rating: 4.9,
        image: 'https://via.placeholder.com/300x200',
        amenities: ['Premium Courts', 'Pro Shop', 'Restaurant', 'Parking'],
        price: 500,
        availableSlots: [
          { time: '09:00-10:00', available: true },
          { time: '10:00-11:00', available: true },
          { time: '11:00-12:00', available: true },
          { time: '12:00-13:00', available: false },
          { time: '13:00-14:00', available: true },
          { time: '14:00-15:00', available: true },
          { time: '15:00-16:00', available: true },
          { time: '16:00-17:00', available: true },
          { time: '17:00-18:00', available: false },
          { time: '18:00-19:00', available: true },
          { time: '19:00-20:00', available: true },
          { time: '20:00-21:00', available: true }
        ]
      },
      {
        name: 'District Sports Silom',
        location: 'Silom Road, Bangkok',
        distance: '5.2 km',
        courts: 3,
        rating: 4.7,
        image: 'https://via.placeholder.com/300x200',
        amenities: ['City View', 'Equipment Rental', 'Shower', 'WiFi'],
        price: 350,
        availableSlots: [
          { time: '09:00-10:00', available: true },
          { time: '10:00-11:00', available: false },
          { time: '11:00-12:00', available: true },
          { time: '12:00-13:00', available: true },
          { time: '13:00-14:00', available: false },
          { time: '14:00-15:00', available: true },
          { time: '15:00-16:00', available: true },
          { time: '16:00-17:00', available: true },
          { time: '17:00-18:00', available: true },
          { time: '18:00-19:00', available: false },
          { time: '19:00-20:00', available: true },
          { time: '20:00-21:00', available: true }
        ]
      }
    ];

    await Venue.insertMany(initialVenues);
    console.log('✅ Initial venues created');
  } catch (error) {
    console.error('❌ Error seeding initial data:', error);
  }
};

// Start the server
startServer();
