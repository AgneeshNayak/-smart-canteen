const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { adminAuth, auth } = require('../middleware/auth');

// POST /api/qr/generate (admin generates session QR)
router.post('/generate', adminAuth, async (req, res) => {
  try {
    const { session, date } = req.body;
    const targetSession = session || 'lunch';
    const targetDate = date || new Date().toISOString().split('T')[0];
    const data = JSON.stringify({ session: targetSession, date: targetDate });
    const qrImage = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 });
    res.json({ qrImage, data: { session: targetSession, date: targetDate } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/qr/session/:session (get session QR)
router.get('/session/:session', auth, async (req, res) => {
  try {
    const { session } = req.params;
    const targetSession = session || 'lunch';
    const targetDate = req.query.date || new Date().toISOString().split('T')[0];
    const data = JSON.stringify({ session: targetSession, date: targetDate });
    const qrImage = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 });
    res.json({ qrImage, session: targetSession, date: targetDate });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
