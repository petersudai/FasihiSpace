const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Fetch all users (add this route)
router.get('/users', getAllUsers);

module.exports = router;