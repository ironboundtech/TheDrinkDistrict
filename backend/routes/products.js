const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Configure multer for image upload (temporary storage for conversion)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
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

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate('createdBy', 'name username email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า' });
  }
});

// Get all products (admin - includes inactive)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึง' });
    }

    const products = await Product.find()
      .populate('createdBy', 'name username email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name username email');
    
    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า' });
  }
});

// Create new product
router.post('/', authenticateToken, handleUpload, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์สร้างสินค้า' });
    }

    const { name, category, price, description, stock } = req.body;
    
    // Validate required fields
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลที่จำเป็น' });
    }

    const productData = {
      name,
      category,
      price: parseFloat(price),
      description: description || '',
      stock: parseInt(stock) || 0,
      createdBy: req.user._id
    };

    // Add image as Base64 if uploaded
    if (req.file) {
      productData.image = fileToBase64(req.file);
      console.log('Product image uploaded successfully as Base64:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    }

    const product = new Product(productData);
    await product.save();

    const savedProduct = await Product.findById(product._id)
      .populate('createdBy', 'name username email');

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างสินค้า' });
  }
});

// Update product
router.put('/:id', authenticateToken, handleUpload, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์แก้ไขสินค้า' });
    }

    const { name, category, price, description, stock, isActive } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }

    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = parseFloat(price);
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = parseInt(stock);
    if (isActive !== undefined) product.isActive = isActive === 'true';

    // Update image if new one uploaded
    if (req.file) {
      product.image = fileToBase64(req.file);
      console.log('Product image updated successfully as Base64:', {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'name username email');

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการแก้ไขสินค้า' });
  }
});

// Delete product
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'ไม่มีสิทธิ์ลบสินค้า' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'ไม่พบสินค้า' });
    }

    res.json({ message: 'ลบสินค้าสำเร็จ' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบสินค้า' });
  }
});

// Get product categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการโหลดหมวดหมู่สินค้า' });
  }
});

module.exports = router;
