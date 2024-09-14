const express = require('express');
const { addComment, getCommentsByPost, updateComment, deleteComment } = require('../controllers/commentController');
const auth = require('../middleware/auth');
const router = express.Router();

// Add a new comment
router.post('/', auth, addComment);

// Get comments for a post
router.get('/:postId', getCommentsByPost);

// Update comment
router.put('/:commentId', auth, updateComment);

// Delete comment
router.delete('/:commentId', auth, deleteComment);

module.exports = router;
