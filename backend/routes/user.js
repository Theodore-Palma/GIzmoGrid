const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Login an existing user
router.post('/login', loginUser);

// Get user profile (requires authentication)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;
