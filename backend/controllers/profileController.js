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
    const posts = await Post.find({ user: req.user.id }); // Fetch all posts by the user
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
