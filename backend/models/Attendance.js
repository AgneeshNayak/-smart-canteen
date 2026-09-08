const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  sessionType: { type: String, enum: ['breakfast', 'lunch', 'snack', 'dinner'], required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Unique attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
