const Post = require('../models/Post');

// Create a new blog post
exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({
      user: req.user.id,
      title: req.body.title,
      body: req.body.body
    });
    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get all blog posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name');
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', ['name', '_id']);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a blog post
exports.updatePost = async (req, res) => {
  try {
    // Find the post by ID
    let post = await Post.findById(req.params.id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user requesting the update is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Update the post content
    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },  // Update with new data
      { new: true }  // Return the updated post
    );

    res.json(post);  // Send the updated post back to the client
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a blog post
exports.deletePost = async (req, res) => {
  try {
    // Find the post by ID
    const post = await Post.findById(req.params.id);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user requesting the deletion is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete the post
    await Post.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};