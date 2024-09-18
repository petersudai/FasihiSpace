const express = require('express');
const { getProfile, updateProfile, getUserPosts, getUserProfile, getReadPosts } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const router = express.Router();

// Get basic user profile
router.get('/basic-info', auth, getProfile);

// Update user profile
router.put('/', auth, updateProfile);

// Get posts created by the user
router.get('/posts', auth, getUserPosts);

// Get user's profile info (both own posts and read posts)
router.get('/all-posts', auth, getUserProfile);

// Get the user's read posts
router.get('/read-posts', auth, getReadPosts);


module.exports = router;
