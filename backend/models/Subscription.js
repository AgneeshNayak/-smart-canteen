const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planType: { type: String, enum: ['15-day', '30-day'], required: true },
  totalDays: { type: Number, required: true },
  usedDays: { type: Number, default: 0 },
  remainingDays: { type: Number, required: true },
  paymentScreenshot: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'expired'], default: 'pending' },
  startDate: { type: Date },
  endDate: { type: Date },
  amount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
