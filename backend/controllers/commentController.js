const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Get comments by post ID
exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.find({ postId }).populate('user', 'name').sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a new comment
exports.addComment = async (req, res) => {
  const { postId, body } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const newComment = new Comment({
      body,
      user: req.user.id,
      postId,
    });

    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
