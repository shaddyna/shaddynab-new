const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  deliveryTime: {
    type: String,
    required: [true, 'Please add a delivery time']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['design', 'development', 'marketing', 'writing', 'video', 'music', 'business', 'other']
  },
  skills: {
    type: [String],
    required: [true, 'Please select at least one skill']
  },
  inclusions: [String],
  images: [String], // Will store Cloudinary URLs
  about: {
    type: String,
    required: [true, 'Please add detailed information about your service']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must not be more than 5']
  }
});

module.exports = mongoose.model('Skill', skillSchema);