// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
}

const connectDB = require('./DB/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const auth = require('./middleware/auth');
const userRoutes = require('./routes/user');
const heroRoutes = require('./routes/hero');
const skillRoutes = require('./routes/skill');
const aboutRoutes = require('./routes/about');
const educationRoutes = require('./routes/education');
const messageRoutes = require('./routes/message');
const projectRoutes = require('./routes/project');
const resumeRoutes = require('./routes/resume');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later"
});

const express = require('express');
const app = express();

const allowedOrigins = [
  'http://localhost:5173',      // Local frontend development
  'http://localhost:3000',      // Local admin frontend development
  'http://localhost:5174',      // Alternative local port
  process.env.FRONTEND_URL,     // Main portfolio - Vercel URL
  process.env.ADMIN_FRONTEND_URL, // Admin dashboard - Vercel URL
].filter(Boolean); // null/undefined values remove karke

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// Connect to DB on first request (lazy connection for Vercel)
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('DB Connection failed:', error);
    }
  }
  next();
});

app.use('/api/users', limiter, userRoutes);
app.use('/api/hero', heroRoutes);  
app.use('/api/skill', skillRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/resume', auth, resumeRoutes);

// Health check endpoint for Vercel
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

module.exports = app;
