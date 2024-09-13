const express = require('express');
const { addComment, getCommentsByPost } = require('../controllers/commentController');
const auth = require('../middleware/auth'); // Ensure user is authenticated

const router = express.Router();

// Add a new comment
router.post('/', auth, addComment);

// Get comments for a post
router.get('/:postId', getCommentsByPost);

module.exports = router;
