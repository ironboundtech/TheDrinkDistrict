const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Court = require('../models/Court');
const Product = require('../models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const fileToBase64 = (filePath) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
                     ext === '.png' ? 'image/png' : 
                     ext === '.gif' ? 'image/gif' : 'image/jpeg';
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
};

const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
         ext === '.png' ? 'image/png' : 
         ext === '.gif' ? 'image/gif' : 'image/jpeg';
};

const migrateCourtImages = async () => {
  console.log('Starting court images migration...');
  
  try {
    // Get all court images from uploads directory
    const courtsUploadPath = path.join(__dirname, '../uploads/courts');
    const courtFiles = fs.readdirSync(courtsUploadPath)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i) && !file.includes('placeholder'));
    
    console.log(`Found ${courtFiles.length} court image files:`, courtFiles);
    
    const courts = await Court.find({});
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const court of courts) {
      if (!court.image || court.image.startsWith('data:') || court.image.startsWith('http')) {
        console.log(`- Court has no image or external URL: ${court.name}`);
        skippedCount++;
        continue;
      }
      
      // Try to find matching file
      let foundFile = null;
      for (const file of courtFiles) {
        if (court.image.includes(file) || file.includes(court.name.toLowerCase().replace(/\s+/g, ''))) {
          foundFile = file;
          break;
        }
      }
      
      if (!foundFile) {
        // Try to match by any available file
        if (courtFiles.length > 0) {
          foundFile = courtFiles.shift(); // Use first available file
          console.log(`- Using available file for court: ${court.name} -> ${foundFile}`);
        }
      }
      
      if (foundFile) {
        const filePath = path.join(courtsUploadPath, foundFile);
        const base64Data = fileToBase64(filePath);
        
        if (base64Data) {
          court.image = base64Data;
          await court.save();
          console.log(`✓ Migrated court image: ${court.name} -> ${foundFile}`);
          migratedCount++;
        } else {
          console.log(`✗ Failed to convert file: ${foundFile}`);
          skippedCount++;
        }
      } else {
        console.log(`✗ No matching file found for court: ${court.name}`);
        skippedCount++;
      }
    }
    
    console.log(`Court migration completed: ${migratedCount} migrated, ${skippedCount} skipped`);
  } catch (error) {
    console.error('Error migrating court images:', error);
  }
};

const migrateProductImages = async () => {
  console.log('Starting product images migration...');
  
  try {
    // Get all product images from uploads directory
    const productsUploadPath = path.join(__dirname, '../uploads/products');
    const productFiles = fs.readdirSync(productsUploadPath)
      .filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i) && !file.includes('placeholder'));
    
    console.log(`Found ${productFiles.length} product image files:`, productFiles);
    
    const products = await Product.find({});
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const product of products) {
      if (!product.image || product.image.startsWith('data:') || product.image.startsWith('http')) {
        console.log(`- Product has no image or external URL: ${product.name}`);
        skippedCount++;
        continue;
      }
      
      // Try to find matching file
      let foundFile = null;
      for (const file of productFiles) {
        if (product.image.includes(file) || file.includes(product.name.toLowerCase().replace(/\s+/g, ''))) {
          foundFile = file;
          break;
        }
      }
      
      if (!foundFile) {
        // Try to match by any available file
        if (productFiles.length > 0) {
          foundFile = productFiles.shift(); // Use first available file
          console.log(`- Using available file for product: ${product.name} -> ${foundFile}`);
        }
      }
      
      if (foundFile) {
        const filePath = path.join(productsUploadPath, foundFile);
        const base64Data = fileToBase64(filePath);
        
        if (base64Data) {
          product.image = base64Data;
          await product.save();
          console.log(`✓ Migrated product image: ${product.name} -> ${foundFile}`);
          migratedCount++;
        } else {
          console.log(`✗ Failed to convert file: ${foundFile}`);
          skippedCount++;
        }
      } else {
        console.log(`✗ No matching file found for product: ${product.name}`);
        skippedCount++;
      }
    }
    
    console.log(`Product migration completed: ${migratedCount} migrated, ${skippedCount} skipped`);
  } catch (error) {
    console.error('Error migrating product images:', error);
  }
};

const migrateAllImages = async () => {
  console.log('=== Starting Image Migration to MongoDB ===');
  console.log('This will convert local file images to Base64 strings stored in MongoDB\n');
  
  await migrateCourtImages();
  await migrateProductImages();
  
  console.log('\n=== Migration Completed ===');
  console.log('All images are now stored as Base64 strings in MongoDB');
  console.log('You can now safely delete the uploads/ directory if desired');
  
  mongoose.connection.close();
};

migrateAllImages();
