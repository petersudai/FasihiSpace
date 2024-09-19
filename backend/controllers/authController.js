const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate incoming request
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    console.log(`Received user data: ${JSON.stringify(req.body)}`);

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    user = new User({ name, email, password });

    console.log('User instance created, password will be hashed in pre-save hook.');

    // Save the user to the database (password will be hashed automatically)
    const savedUser = await user.save();
    console.log('User saved successfully:', savedUser);

    // Create JWT payload
    const payload = {
      user: {
        id: savedUser._id,
      },
    };

    // Sign the JWT token and return it
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      console.log('JWT generated:', token);
      res.status(201).json({
        token,
        user: { _id: savedUser._id, name: savedUser.name, email: savedUser.email },
      });
    });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).send('Server error');
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate incoming request
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user._id,
        name: user.name,
      },
    };

    // Sign the JWT token and return it
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { _id: user._id, name: user.name, email: user.email },
        });
      }
    );
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).send('Server error');
  }
};


// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email');
    res.json(users);
  } catch (err) {
    console.error('Error logging in user:', err.message);
    res.status(500).send('Server error');
  }
};

// Fetch the current authenticated user
exports.getAuthenticatedUser = async (req, res) => {
  try {
    // The user is already authenticated, so we fetch the user data using req.user.id
    const user = await User.findById(req.user.id).select('-password');  // Exclude password
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
