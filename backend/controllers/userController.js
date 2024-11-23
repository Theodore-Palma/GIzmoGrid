const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Initialize OAuth2Client with the Google Client ID from environment variables
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// Normal login
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


exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Ensure this matches your Google Client ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if the user already exists based on email or Google ID
    let user = await User.findOne({ googleId });

    if (!user) {
      // If the user doesn't exist, create a new user with data from Google
      user = new User({
        email,
        username: name,  // Use the Google name as the username
        avatar: picture, // Use the Google avatar
        googleId,        // Store the Google ID
        loginType: 'google',  // Set loginType to 'google'
      });
      await user.save();  // Save the new user
    }

    // Generate JWT token to log the user in automatically
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, name: user.username },
      process.env.JWT_SECRET, // Your JWT secret
      { expiresIn: '1h' } // Token expiration time
    );

    // Respond with the JWT token for automatic login
    res.json({
      message: 'Google Login successful',
      token: jwtToken, // Send the token back to the client
      user: {
        name: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ error: 'Invalid Google token or server error' });
  }
};