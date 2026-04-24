const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Food', 'Water', 'Medicine', 'Funds', 'Other'],
    required: true 
  },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }, // e.g., 'boxes', 'liters', 'USD'
  location: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
