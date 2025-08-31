const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  }
});

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  courts: {
    type: Number,
    required: true,
    min: 1
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  image: {
    type: String,
    required: true
  },
  amenities: [{
    type: String
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSlots: [timeSlotSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Venue', venueSchema);
