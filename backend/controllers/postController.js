const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const TurndownService = require('turndown');
const turndownService = new TurndownService();

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // the uploads folder
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }  // 10 MB limit 
});

// Create a new blog post
exports.createPost = [
  upload.single('image'),
  async (req, res) => {
    // Log incoming data
    console.log(req.file);
    console.log(req.body);

    const { title, body } = req.body;

    // Log for debugging
    console.log('Received body:', body);
    console.log('Received title:', title);
    console.log('Received file:', req.file ? req.file.filename : 'No file uploaded');

    // Convert HTML body to Markdown
    const markdownBody = turndownService.turndown(body);

    if (!title || !markdownBody) {
      return res.status(400).json({ msg: 'Title and body are required' });
    }

    try {
      const newPost = new Post({
        user: req.user.id,
        title,
        body: markdownBody,
        titleImage: req.file ? `/uploads/${req.file.filename}` : null
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];

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

// Update an existing post
exports.editPost = [
  upload.single('image'),
  async (req, res) => {
    const { title, body } = req.body;

    try {
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }

      post.title = title;
      post.body = body;
      post.titleImage = req.file ? `/uploads/${req.file.filename}` : post.titleImage;

      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
];


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

// Search and Filter posts
exports.searchPosts = async (req, res) => {
  const { title, content, author, date, tags, sortBy } = req.query;

  const query = {};

  // Build query based on ssearch parameter
  if (title) {
    query.title = { $regex: title, $options: 'i'};
  }

  if (content) {
    query.body = { $regex: content, $options: 'i'};
  }

  if (author) {
    const authorRegex = new RegExp (author, 'i');
    query['user.name'] = authorRegex
  }
  
  // Filtering
  if (tags) {
    query.tags = { $in: tags.split(',') };;
  }

  if (date) {
    query.date = { $gte: new Date(date) };
  }

  // Sort by 'date' or 'likes'
  let sort = {};
  if (sortBy === 'most_popular') {
    sort = { likes: -1 }; // Sort by most likes
  } else if (sortBy === 'date') {
    sort = { date: -1 }; // Sort by most recent date
  }

  try {
    const posts = await Post.find(query).sort(sort);
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};