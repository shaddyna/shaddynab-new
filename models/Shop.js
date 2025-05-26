const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a shop name'],
    trim: true,
    maxlength: [100, 'Shop name cannot be more than 100 characters']
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  categories: {
    type: [String],
    required: [true, 'Please select at least one category'],
    enum: ['fashion', 'home', 'art', 'jewelry', 'beauty', 'electronics', 'food', 'other']
  },
  image: {
    type: String,
    required: [true, 'Please upload a shop image']
  },
  contact: {
    email: {
      type: String,
      required: [true, 'Please add an email']
    },
    phone: String,
    instagram: String,
    facebook: String,
    twitter: String
  },
  workingHours: {
    type: Map,
    of: {
      open: String,
      close: String,
      closed: Boolean
    },
    required: true
  },
  policies: {
    returnPolicy: String,
    shippingPolicy: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Ensure a user can only have one shop
shopSchema.index({ owner: 1 }, { unique: true });

module.exports = mongoose.model('Shop', shopSchema);