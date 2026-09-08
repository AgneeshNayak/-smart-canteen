const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Subscription = require('../models/Subscription');

// POST /api/attendance/scan
router.post('/scan', auth, async (req, res) => {
  try {
    const { session, date, studentId } = req.body;

    // Find user's active subscription
    const sub = await Subscription.findOne({ userId: req.user._id, status: 'approved' });
    if (!sub) return res.status(400).json({ message: 'No active subscription found' });
    if (sub.remainingDays <= 0) return res.status(400).json({ message: 'Subscription expired. Please renew.' });

    const today = date || new Date().toISOString().split('T')[0];

    // Check if attendance already recorded today
    const existing = await Attendance.findOne({ userId: req.user._id, date: today });
    if (existing) {
      return res.status(200).json({
        message: `Attendance already recorded today (${existing.sessionType})`,
        alreadyRecorded: true,
        attendance: existing
      });
    }

    // Create attendance
    const attendance = await Attendance.create({
      userId: req.user._id,
      date: today,
      sessionType: session
    });

    // Deduct 1 day
    sub.usedDays += 1;
    sub.remainingDays -= 1;
    if (sub.remainingDays <= 0) sub.status = 'expired';
    await sub.save();

    res.json({
      message: `✅ Attendance recorded for ${session}!`,
      attendance,
      remainingDays: sub.remainingDays
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(200).json({ message: 'Attendance already recorded today', alreadyRecorded: true });
    }
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/history
router.get('/history', auth, async (req, res) => {
  try {
    const records = await Attendance.find({ userId: req.user._id }).sort({ date: -1 }).limit(30);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/attendance/today
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const record = await Attendance.findOne({ userId: req.user._id, date: today });
    res.json({ attended: !!record, record });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
