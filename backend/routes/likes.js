const express = require('express');
const router = express.Router();
const { likePost, unlikePost, getLikes, isLiked } = require('../controllers/likeController');
const auth = require('../middleware/auth');

router.post('/:postId', auth, likePost);  // Like a post
router.delete('/:postId', auth, unlikePost);  // Unlike a post
router.get('/:postId', getLikes);  // Get total likes for a post
router.get('/:postId/isLiked', auth, isLiked);  // Check if a post is liked by the logged-in user

module.exports = router;
