const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token');

  // Log the token received in the headers
  console.log('Token received in middleware:', token);

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assign the user from the token to req.user
    req.user = decoded.user;

    console.log('Decoded user in middleware:', decoded);
    
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
