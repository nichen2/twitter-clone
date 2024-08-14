const express = require('express');
const router = express.Router();
const { signup, login, logout, deleteUser } = require('../controllers/authController');

// Register route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Delete user route
router.delete('/delete', deleteUser);

module.exports = router;
