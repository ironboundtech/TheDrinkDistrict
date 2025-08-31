const fs = require('fs');
const path = require('path');

// Setup uploads directories
const setupUploads = () => {
  try {
    // Create main uploads directory
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('✅ Created uploads directory');
    }

    // Create courts subdirectory
    const courtsDir = path.join(uploadsDir, 'courts');
    if (!fs.existsSync(courtsDir)) {
      fs.mkdirSync(courtsDir, { recursive: true });
      console.log('✅ Created uploads/courts directory');
    }

    // Create products subdirectory
    const productsDir = path.join(uploadsDir, 'products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
      console.log('✅ Created uploads/products directory');
    }

    // Set permissions (for Unix-like systems)
    try {
      fs.chmodSync(uploadsDir, 0o755);
      fs.chmodSync(courtsDir, 0o755);
      fs.chmodSync(productsDir, 0o755);
      console.log('✅ Set directory permissions');
    } catch (error) {
      console.log('⚠️  Could not set permissions (this is normal on Windows)');
    }

    console.log('🎉 Uploads directories setup complete!');
  } catch (error) {
    console.error('❌ Error setting up uploads directories:', error);
    process.exit(1);
  }
};

// Run setup
setupUploads();
