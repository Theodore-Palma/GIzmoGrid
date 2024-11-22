const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Check if token is in 'Bearer <token>' format
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length); // Remove 'Bearer ' part
  } else {
    return res.status(403).json({ message: 'Invalid token format' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.userId; // Use 'userId' from the token
    next();
  });
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Require Admin Role' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { verifyToken, isAdmin };
