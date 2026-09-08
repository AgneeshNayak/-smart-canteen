const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, studentId, email, phone, password } = req.body;

    if (!name || !studentId || !email || !phone || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ $or: [{ email }, { studentId }] });
    if (exists) return res.status(400).json({ message: 'Email or Student ID already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, studentId, email, phone, password: hashed });

    const secret = process.env.JWT_SECRET || 'canteen_super_secret_key_2024';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: user.role, studentId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET || 'canteen_super_secret_key_2024';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, studentId: user.studentId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
