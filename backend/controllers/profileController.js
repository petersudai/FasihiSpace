const User = require('../models/User');
const Post = require('../models/Post');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { name, email, profilePicture } = req.body;

  const updatedData = {};
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (profilePicture) updatedData.profilePicture = profilePicture;

  try {
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Update user profile
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get posts created by the user
exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(400).json({ msg: 'User is not authenticated' });
    }

    const posts = await Post.find({ user: req.user.id }); // Fetch all posts by the user
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Fetch user's posts and read posts
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('posts').populate('readPosts');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const ownPosts = user.posts;
    const readPosts = user.readPosts;

    res.json({ ownPosts, readPosts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get the user's read posts
exports.getReadPosts = async (req, res) => {
  try {
    // Populate the user's read posts
    const user = await User.findById(req.user.id).populate('readPosts');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('Returning read posts:', user.readPosts);
    res.json(user.readPosts); // Return the read posts
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};