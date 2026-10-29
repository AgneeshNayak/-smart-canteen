const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/qr', require('./routes/qr'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/canteen_db';
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    // Seed admin user
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    User.findOne({ role: 'admin' }).then(admin => {
      if (!admin) {
        const hashed = bcrypt.hashSync('admin123', 10);
        User.create({
          name: 'Admin',
          studentId: 'ADMIN001',
          email: 'admin@canteen.com',
          phone: '9999999999',
          password: hashed,
          role: 'admin'
        }).then(() => console.log('✅ Default admin created: admin@canteen.com / admin123'));
      }
    });
  })
  .catch(err => console.error('❌ MongoDB Error:', err));

// Global JSON Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the existing process or set a different PORT in .env`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('\n🛑 Server and database connection closed.');
      process.exit(0);
    });
  });
});

