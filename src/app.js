require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const path = require('path');
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

app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

connectDB();

app.use('/api/users', limiter, userRoutes);
app.use('/api/hero', heroRoutes);  
app.use('/api/skill', skillRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/resume', auth, resumeRoutes);



module.exports = app;
