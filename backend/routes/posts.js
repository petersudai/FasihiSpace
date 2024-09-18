const express = require('express');
const { createPost, getPosts, getPostByID, editPost, deletePost, searchPosts } = require('../controllers/postController');
const auth = require('../middleware/auth');
const router = express.Router();

// Create a new blog post
router.post('/', auth, createPost);

// Update a blog post (Only the owner can update)
router.put('/:id', auth, editPost);

// Get all blog posts
router.get('/', getPosts);

// Get a single post by ID
router.get('/:id', auth, getPostByID);

// Delete a blog post (Only the owner can delete)
router.delete('/:id', auth, deletePost);

// Search and filter posts
router.get('/search', searchPosts);

module.exports = router;
