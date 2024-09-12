const express = require('express');
const { getProfile, updateProfile, getUserPosts } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/', auth, getProfile);

// Update user profile
router.put('/', auth, updateProfile);

// Get posts created by the user
router.get('/posts', auth, getUserPosts);

module.exports = router;
