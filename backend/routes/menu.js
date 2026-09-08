const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Menu = require('../models/Menu');

// GET /api/menu/today
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let menu = await Menu.findOne({ date: today });
    if (!menu) {
      menu = {
        date: today,
        breakfast: 'Idli, Vada, Sambar, Chutney',
        lunch: 'Rice, Dal Fry, Aloo Sabzi, Roti, Salad, Papad',
        snack: 'Chai/Coffee, Bread Butter, Biscuits',
        dinner: 'Roti, Dal Makhani, Paneer Curry, Rice, Kheer'
      };
    }
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/menu/update (admin)
router.post('/update', adminAuth, async (req, res) => {
  try {
    const { date, breakfast, lunch, snack, dinner } = req.body;
    const menu = await Menu.findOneAndUpdate(
      { date },
      { breakfast, lunch, snack, dinner },
      { upsert: true, new: true }
    );
    res.json({ message: 'Menu updated', menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
