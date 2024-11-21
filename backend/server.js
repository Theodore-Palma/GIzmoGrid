// server.js
const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv").config();
const userRoutes = require('./routes/userRoutes');

const imageRoutes = require('./routes/imageRoutes');

// In server.js
const cors = require('cors');
app.use(cors());  // Enable CORS for all origins


// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/users', userRoutes);

// Image upload route
app.use('/api/images', imageRoutes);

app.get("/", (req, res) => {
  res.send("Home page");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
