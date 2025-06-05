const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: false },
  mpesaCode: { type: String, required: true },
  amount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['inactive', 'pending', 'active'], default: 'inactive' },
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
