const express = require('express');
const { createPost, getPosts, getPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('../middleware/auth');  // JWT auth middleware
const router = express.Router();

// Create a new blog post
router.post('/', auth, createPost);

// Get all blog posts
router.get('/', getPosts);

// Get a single post by ID
router.get('/:id', getPost);

// Update a blog post (Only the owner can update)
router.put('/:id', auth, updatePost);

// Delete a blog post (Only the owner can delete)
router.delete('/:id', auth, deletePost);

module.exports = router;
