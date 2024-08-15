const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(cors({ origin: 'https://twitter-clone-1-fmj9.onrender.com', credentials: true }));
app.use(express.json());

// Configure session management
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    maxAge: 18000000,
    sameSite: 'None' 
  } 
}));

// Import routes
const authRoutes = require('./routes/authRoutes');
const tweetRoutes = require('./routes/tweetRoutes');
const likeRoutes = require('./routes/likeRoutes');
const followRoutes = require('./routes/followRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/auth', authRoutes);
app.use('/tweets', tweetRoutes);
app.use('/tweets', likeRoutes);
app.use('/users', followRoutes);
app.use('/users', userRoutes);

module.exports = app;
