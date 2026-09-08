const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Subscription = require('../models/Subscription');

// GET /api/subscription/my
router.get('/my', auth, async (req, res) => {
  try {
    const sub = await Subscription.findOne({ userId: req.user._id, status: { $in: ['pending', 'approved'] } })
      .sort({ createdAt: -1 });
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/subscription/subscribe
router.post('/subscribe', auth, upload.single('paymentScreenshot'), async (req, res) => {
  try {
    const { planType } = req.body;

    // Check existing active subscription
    const existing = await Subscription.findOne({ userId: req.user._id, status: { $in: ['pending', 'approved'] } });
    if (existing) return res.status(400).json({ message: 'You already have an active or pending subscription' });

    const totalDays = planType === '15-day' ? 15 : 30;
    const amount = planType === '15-day' ? 1500 : 2800;

    const sub = await Subscription.create({
      userId: req.user._id,
      planType,
      totalDays,
      remainingDays: totalDays,
      paymentScreenshot: req.file ? req.file.filename : '',
      amount
    });

    res.status(201).json({ message: 'Subscription request submitted. Awaiting admin approval.', subscription: sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/subscription/history
router.get('/history', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
