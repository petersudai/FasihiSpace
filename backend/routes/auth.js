const express = require('express');
const { registerUser, loginUser, getAllUsers, getAuthenticatedUser } = require('../controllers/authController');
const router = express.Router();
const auth = require('../middleware/auth');

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Fetch all users (add this route)
router.get('/users', getAllUsers);

// Protected route to get the current authenticated user
router.get('/me', auth, getAuthenticatedUser);

module.exports = router;