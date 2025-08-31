const mongoose = require('mongoose');

// Define role enum
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager', 
  GUEST_INVESTOR: 'guest_investor',
  STAFF: 'staff',
  USER: 'user'
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  avatar: {
    type: String
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  preferences: {
    favoriteSports: [String],
    preferredVenues: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Venue'
    }]
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for checking if user is admin
userSchema.virtual('isAdmin').get(function() {
  return this.role === ROLES.ADMIN;
});

// Virtual for checking if user is manager or admin
userSchema.virtual('isManagerOrAdmin').get(function() {
  return this.role === ROLES.ADMIN || this.role === ROLES.MANAGER;
});

// Method to check if user has permission
userSchema.methods.hasPermission = function(requiredRole) {
  const roleHierarchy = {
    [ROLES.USER]: 1,
    [ROLES.STAFF]: 2,
    [ROLES.GUEST_INVESTOR]: 3,
    [ROLES.MANAGER]: 4,
    [ROLES.ADMIN]: 5
  };
  
  return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
};

// Export both the model and the ROLES enum
module.exports = {
  User: mongoose.model('User', userSchema),
  ROLES
};
