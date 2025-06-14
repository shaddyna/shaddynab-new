const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.ObjectId,
    ref: 'Skill',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },

  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  },
  budget: {
    type: String,
    required: [true, 'Please provide a budget']
  },
  timeline: {
    type: String,
    required: [true, 'Please provide a timeline']
  },
  status: {
    type: String,
    enum: ['pending', 'responded', 'completed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate inquiries from the same user for the same service
inquirySchema.index({ service: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Inquiry', inquirySchema);