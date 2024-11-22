const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password) {
        console.log('Missing fields:', req.body);
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.log('Error during registration:', error);
      res.status(400).json({ error: 'Error registering user' });
    }
  };
  
  exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
  
      // If user doesn't exist or password is incorrect
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role }, // Include role in the JWT payload
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      // Send success response with token and role
      res.json({
        message: 'Login successful',
        token,
        role: user.role // Include the role in the response
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
