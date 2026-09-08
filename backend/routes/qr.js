const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { adminAuth, auth } = require('../middleware/auth');

// POST /api/qr/generate (admin generates session QR)
router.post('/generate', adminAuth, async (req, res) => {
  try {
    const { session } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.stringify({ session, date: today });
    const qrImage = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 });
    res.json({ qrImage, data: { session, date: today } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/qr/session/:session (get current session QR)
router.get('/session/:session', auth, async (req, res) => {
  try {
    const { session } = req.params;
    const today = new Date().toISOString().split('T')[0];
    const data = JSON.stringify({ session, date: today });
    const qrImage = await QRCode.toDataURL(data, { errorCorrectionLevel: 'H', width: 300 });
    res.json({ qrImage, session, date: today });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
