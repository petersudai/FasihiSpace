const Like = require('../models/Like');
const Post = require('../models/Post');

// Like a post
exports.likePost = async (req, res) => {
  const { postId } = req.params;
  console.log("Received postId for like:", postId);

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const existingLike = await Like.findOne({ user: req.user.id, post: postId });
    if (existingLike) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    const like = new Like({ user: req.user.id, post: postId });
    await like.save();
    res.json(like);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


// Unlike a post
exports.unlikePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const like = await Like.findOne({ user: req.user.id, post: postId });
    if (!like) {
      return res.status(404).json({ msg: 'Like not found' });
    }

    await like.deleteOne();
    const totalLikes = await Like.countDocuments({ post: postId });
    res.json({ msg: 'Like removed', totalLikes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get total likes for a post
exports.getLikes = async (req, res) => {
  const { postId } = req.params;
  try {
    const likesCount = await Like.countDocuments({ post: postId });
    res.json({ likesCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Check if the user has liked a specific post
exports.isLiked = async (req, res) => {
  const { postId } = req.params;
  try {
    const like = await Like.findOne({ user: req.user.id, post: postId });
    if (like) {
      return res.json({ isLiked: true });
    }
    return res.json({ isLiked: false });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
};
