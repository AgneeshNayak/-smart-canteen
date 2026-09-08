# 🍽️ Smart Canteen Subscription Web App

A modern, full-stack canteen management system with QR-based attendance, subscription plans, and beautiful dashboards.

---

## 📁 Project Structure

```
canteen-app/
├── index.html                  ← Landing page (open this in browser)
├── frontend/
│   ├── css/
│   │   └── style.css           ← All styles (dark theme, modern UI)
│   ├── js/
│   │   └── app.js              ← Shared JS utilities & API calls
│   └── pages/
│       ├── login.html          ← Student/Admin login
│       ├── register.html       ← Student registration
│       ├── dashboard.html      ← Student dashboard
│       └── admin.html          ← Admin dashboard
└── backend/
    ├── server.js               ← Main Express server
    ├── .env                    ← Environment variables
    ├── package.json
    ├── models/
    │   ├── User.js
    │   ├── Subscription.js
    │   ├── Attendance.js
    │   └── Menu.js
    ├── routes/
    │   ├── auth.js
    │   ├── subscription.js
    │   ├── attendance.js
    │   ├── menu.js
    │   ├── admin.js
    │   └── qr.js
    └── middleware/
        ├── auth.js             ← JWT middleware
        └── upload.js           ← Multer file upload
```

---

## ✅ Prerequisites

Make sure these are installed on your computer:

| Tool       | Download                              | Check if installed       |
|------------|---------------------------------------|--------------------------|
| Node.js    | https://nodejs.org (v18+ recommended) | `node --version`         |
| MongoDB    | https://www.mongodb.com/try/download/community | `mongod --version` |
| npm        | Comes with Node.js                    | `npm --version`          |

---

## 🚀 Step-by-Step Setup

### STEP 1 — Start MongoDB

**Windows:**
```bash
# Option A: If MongoDB is installed as a service, it may already be running.
# Open Services → find MongoDB → Start

# Option B: Start manually
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"

# Make sure the folder exists first:
mkdir C:\data\db
```

**macOS:**
```bash
# If installed with Homebrew:
brew services start mongodb-community

# Or manually:
mongod --dbpath /usr/local/var/mongodb
```

**Linux (Ubuntu/Debian):**
```bash
sudo systemctl start mongod
sudo systemctl enable mongod   # auto-start on boot
```

**Verify MongoDB is running:**
```bash
mongosh
# You should see: "Connected to mongodb://127.0.0.1:27017"
# Type: exit
```

---

### STEP 2 — Install Backend Dependencies

Open a terminal and navigate to the backend folder:

```bash
cd canteen-app/backend
npm install
```

This installs: express, mongoose, bcryptjs, jsonwebtoken, multer, qrcode, cors, dotenv, nodemon.

---

### STEP 3 — Configure Environment Variables

The `.env` file is already created at `backend/.env` with these defaults:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/canteen_db
JWT_SECRET=canteen_super_secret_key_2024
NODE_ENV=development
```

⚠️ **Change `JWT_SECRET` to a long random string in production!**

---

### STEP 4 — Start the Backend Server

```bash
# From inside canteen-app/backend/
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected
✅ Default admin created: admin@canteen.com / admin123
```

> 💡 If you see `npm run dev` error, use `node server.js` instead (requires nodemon for `dev`).

---

### STEP 5 — Open the Frontend

The frontend is plain HTML/CSS/JS — **no build step needed!**

**Option A — Open directly in browser:**
```
Double-click:  canteen-app/index.html
```

**Option B — Serve with VS Code Live Server (recommended):**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens at `http://127.0.0.1:5500`

**Option C — Serve with Node http-server:**
```bash
npm install -g http-server
cd canteen-app
http-server -p 3000
# Open: http://localhost:3000
```

---

### STEP 6 — Test the App

#### 🔑 Admin Login
```
URL:      frontend/pages/login.html   (or admin.html)
Email:    admin@canteen.com
Password: admin123
```

#### 👤 Student Registration
```
URL:      frontend/pages/register.html
Fill in all fields and register
```

#### Complete Flow:
1. Register as student → Login → Dashboard
2. Go to **Subscribe** → Select plan → Upload any image as payment screenshot
3. Login as **Admin** → Go to **Payments** → Approve the payment
4. Back as Student → Dashboard shows subscription active
5. Go to **Scan QR** → Click "Mark Attendance" (or scan QR with camera)
6. Admin → **Attendance** tab shows today's records

---

## 🔐 Default Credentials

| Role    | Email               | Password  |
|---------|---------------------|-----------|
| Admin   | admin@canteen.com   | admin123  |
| Student | (register yourself) | your choice |

---

## 🌐 API Endpoints Reference

| Method | Endpoint                        | Auth     | Description              |
|--------|---------------------------------|----------|--------------------------|
| POST   | /api/auth/register              | None     | Student registration     |
| POST   | /api/auth/login                 | None     | Login (returns JWT)      |
| GET    | /api/subscription/my            | Student  | Get my subscription      |
| POST   | /api/subscription/subscribe     | Student  | Subscribe to a plan      |
| POST   | /api/attendance/scan            | Student  | Mark attendance via QR   |
| GET    | /api/attendance/history         | Student  | Attendance history       |
| GET    | /api/attendance/today           | Student  | Today's attendance       |
| GET    | /api/menu/today                 | Student  | Get today's menu         |
| GET    | /api/admin/stats                | Admin    | Dashboard stats          |
| GET    | /api/admin/students             | Admin    | All students             |
| GET    | /api/admin/pending-payments     | Admin    | Pending payments         |
| POST   | /api/admin/verify-payment       | Admin    | Approve/reject payment   |
| GET    | /api/admin/attendance-today     | Admin    | Today's attendance log   |
| POST   | /api/qr/generate                | Admin    | Generate session QR      |
| GET    | /api/qr/session/:session        | Student  | Get current session QR   |
| POST   | /api/menu/update                | Admin    | Update menu              |

---

## 📱 Features

### Student Features
- 🔐 Register & login with JWT authentication
- 📊 Dashboard with subscription stats & progress bar
- 💳 Choose 15-day (₹1,500) or 30-day (₹2,800) plan
- 📤 Upload payment screenshot for admin approval
- 📷 QR scanner for marking attendance
- 📅 Attendance history with monthly calendar view
- 🍽️ Today's menu for all 4 sessions

### Admin Features
- 📊 Analytics dashboard with Chart.js graphs
- 👥 Student management with search
- ✅ Payment verification (approve/reject)
- 🔲 QR code generator per session (downloadable)
- 📅 Real-time attendance tracking
- 📋 Menu management for all sessions

---

## ⚙️ Subscription Plans

| Plan       | Days | Price  | Cost/Day |
|------------|------|--------|----------|
| 15-Day     | 15   | ₹1,500 | ₹100     |
| 30-Day     | 30   | ₹2,800 | ₹93      |

### Daily Sessions
| Session   | Time            |
|-----------|-----------------|
| Breakfast | 7:30 – 9:00 AM  |
| Lunch     | 12:00 – 2:00 PM |
| Snack     | 3:00 – 5:00 PM  |
| Dinner    | 7:30 – 9:15 PM  |

> ⚡ Attendance Logic: Only **1 day is deducted per day**, regardless of how many sessions are attended.

---

## 🐛 Troubleshooting

**"MongoDB connection failed"**
→ Make sure MongoDB is running (Step 1)
→ Check if port 27017 is free: `netstat -an | grep 27017`

**"Cannot read properties of null (reading 'role')"**
→ Clear browser localStorage: `localStorage.clear()` in browser console

**"CORS error" in browser console**
→ Make sure backend is running on port 5000
→ Check that frontend is making API calls to `http://localhost:5000`

**"Camera not working for QR scan"**
→ QR scanning requires HTTPS or localhost
→ Use the "Mark Attendance" button as an alternative

**Payment screenshot not showing**
→ Backend must be running; images are served from `http://localhost:5000/uploads/`

---

## 🛠️ Tech Stack

| Layer      | Technology                    |
|------------|-------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JS       |
| Styling    | Custom CSS (dark theme)       |
| Charts     | Chart.js                      |
| QR Scan    | html5-qrcode                  |
| Backend    | Node.js + Express.js          |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| Upload     | Multer                        |
| QR Gen     | qrcode npm package            |

---

## 🚀 Production Deployment Tips

1. **Backend**: Deploy to Railway, Render, or Heroku
2. **Database**: Use MongoDB Atlas (free tier available)
3. **Frontend**: Deploy to Netlify or Vercel (update API URL in `frontend/js/app.js`)
4. Update `MONGO_URI` in `.env` to your Atlas connection string
5. Set `JWT_SECRET` to a strong random string
6. Update `const API = 'http://localhost:5000/api'` in `app.js` to your deployed backend URL

---

Made with ❤️ — Smart Canteen v1.0
