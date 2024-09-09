const express = require('express');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');  // JWT auth middleware
const router = express.Router();

// Create a new blog post
router.post('/', auth, createPost);

// Get all blog posts
router.get('/', getPosts);

// Update a blog post
router.put('/:id', auth, updatePost);

// Delete a blog post
router.delete('/:id', auth, deletePost);

module.exports = router;