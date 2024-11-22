const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register a new user
router.post('/products', registerUser);

// Login an existing user
router.post('/products', loginUser);

// Get user profile (requires authentication)
router.get('/products', authMiddleware, getUserProfile);

module.exports = router;
