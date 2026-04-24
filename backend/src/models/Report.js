const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  imageUrl: { type: String }, // mock image url
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
