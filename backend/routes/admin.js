const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Attendance = require('../models/Attendance');

// GET /api/admin/stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeSubscriptions = await Subscription.countDocuments({ status: 'approved' });
    const pendingPayments = await Subscription.countDocuments({ status: 'pending' });
    const todayAttendance = await Attendance.countDocuments({ date: today });
    const revenue = await Subscription.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Last 7 days attendance
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = await Attendance.countDocuments({ date: dateStr });
      last7.push({ date: dateStr, count });
    }

    res.json({
      totalStudents,
      activeSubscriptions,
      pendingPayments,
      todayAttendance,
      revenue: revenue[0]?.total || 0,
      last7DaysAttendance: last7
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/students
router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
    const studentsWithSubs = await Promise.all(students.map(async (student) => {
      const sub = await Subscription.findOne({ userId: student._id, status: { $in: ['pending', 'approved'] } });
      return { ...student.toObject(), subscription: sub };
    }));
    res.json(studentsWithSubs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/pending-payments
router.get('/pending-payments', adminAuth, async (req, res) => {
  try {
    const pending = await Subscription.find({ status: 'pending' })
      .populate('userId', 'name studentId email phone')
      .sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/verify-payment
router.post('/verify-payment', adminAuth, async (req, res) => {
  try {
    const { subscriptionId, action } = req.body; // action: 'approve' | 'reject'
    const sub = await Subscription.findById(subscriptionId);
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    if (action === 'approve') {
      sub.status = 'approved';
      sub.startDate = new Date();
      const end = new Date();
      end.setDate(end.getDate() + sub.totalDays);
      sub.endDate = end;
    } else {
      sub.status = 'expired';
    }
    await sub.save();
    res.json({ message: `Subscription ${action}d successfully`, subscription: sub });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/attendance-today
router.get('/attendance-today', adminAuth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = await Attendance.find({ date: today })
      .populate('userId', 'name studentId')
      .sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
