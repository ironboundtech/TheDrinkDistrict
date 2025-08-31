const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
    required: true
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  amenities: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: '/api/placeholder/300/200'
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  totalBookings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
courtSchema.index({ status: 1 });
courtSchema.index({ venue: 1 });
courtSchema.index({ price: 1 });

// Virtual for checking if court is available for booking
courtSchema.virtual('isAvailable').get(function() {
  return this.status === 'open';
});

// Method to get display status
courtSchema.methods.getDisplayStatus = function() {
  return this.status === 'open' ? 'พร้อมใช้งาน' : 'ไม่พร้อมใช้งาน';
};

module.exports = mongoose.model('Court', courtSchema);
