const express = require('express');
const { registerUser, loginUser, getUserProfile, googleLogin } = require('../controllers/userController'); // Destructured
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser); // Register a user
router.post('/login', loginUser); // Login a user
router.get('/profile', authMiddleware, getUserProfile); // Protected profile route
router.post('/google-login', googleLogin); // Google login route

module.exports = router;
