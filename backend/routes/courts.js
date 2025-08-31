const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken: requireAuth, requireAdmin } = require('../middleware/auth');
const Court = require('../models/Court');

// Configure multer for file uploads (temporary storage for conversion)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
}).single('image');

// Error handling middleware for multer
const handleUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      console.error('Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      // An unknown error occurred when uploading
      console.error('Unknown upload error:', err);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    // Everything went fine
    next();
  });
};

// Helper function to convert file to Base64
const fileToBase64 = (file) => {
  if (!file) return null;
  const base64 = file.buffer.toString('base64');
  const mimeType = file.mimetype;
  return `data:${mimeType};base64,${base64}`;
};

// Get all courts
router.get('/', async (req, res) => {
  try {
    const courts = await Court.find().sort({ createdAt: -1 });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courts', error: error.message });
  }
});

// Get available courts (status: 'open')
router.get('/available', async (req, res) => {
  try {
    const courts = await Court.find({ status: 'open' }).sort({ createdAt: -1 });
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available courts', error: error.message });
  }
});

// Create new court with file upload
router.post('/', requireAuth, requireAdmin, handleUpload, async (req, res) => {
  try {
    const { name, address, price, venue, amenities } = req.body;
    
    if (!name || !address || !price) {
      return res.status(400).json({ message: 'Name, address, and price are required' });
    }

    const courtData = {
      name,
      address,
      price: parseFloat(price),
      venue: venue || '',
      amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
      status: 'open'
    };

    // Add image as Base64 if file was uploaded
    if (req.file) {
      courtData.image = fileToBase64(req.file);
      console.log('Court image uploaded successfully as Base64:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    } else {
      courtData.image = '/api/placeholder/300/200'; // Default placeholder
      console.log('No image uploaded, using placeholder');
    }

    const court = new Court(courtData);
    await court.save();
    
    res.status(201).json(court);
  } catch (error) {
    console.error('Error creating court:', error);
    res.status(500).json({ message: 'Error creating court', error: error.message });
  }
});

// Update court with file upload
router.put('/:id', requireAuth, requireAdmin, handleUpload, async (req, res) => {
  try {
    const { name, address, price, venue, amenities, status } = req.body;
    
    if (!name || !address || !price) {
      return res.status(400).json({ message: 'Name, address, and price are required' });
    }

    const updateData = {
      name,
      address,
      price: parseFloat(price),
      venue: venue || '',
      amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
      status: status || 'open'
    };

    // Add image as Base64 if new file was uploaded
    if (req.file) {
      updateData.image = fileToBase64(req.file);
      console.log('Court image updated successfully as Base64:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    }

    const court = await Court.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json(court);
  } catch (error) {
    console.error('Error updating court:', error);
    res.status(500).json({ message: 'Error updating court', error: error.message });
  }
});

// Delete court
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json({ message: 'Court deleted successfully' });
  } catch (error) {
    console.error('Error deleting court:', error);
    res.status(500).json({ message: 'Error deleting court', error: error.message });
  }
});

// Get court by ID
router.get('/:id', async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    
    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    res.json(court);
  } catch (error) {
    console.error('Error fetching court:', error);
    res.status(500).json({ message: 'Error fetching court', error: error.message });
  }
});

module.exports = router;
