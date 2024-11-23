const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return this.loginType === 'local'; },  // Password required only if loginType is 'local'
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  loginType: { type: String, enum: ['local', 'google'], default: 'local' },  // To track how the user logged in
  googleId: { type: String, unique: true },  // Store Google ID if logged in via Google
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
