const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // YYYY-MM-DD
  breakfast: { type: String, default: 'Idli, Sambar, Chutney' },
  lunch: { type: String, default: 'Rice, Dal, Sabzi, Roti, Salad' },
  snack: { type: String, default: 'Tea, Biscuits, Bread Butter' },
  dinner: { type: String, default: 'Roti, Paneer, Rice, Dal, Dessert' }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
