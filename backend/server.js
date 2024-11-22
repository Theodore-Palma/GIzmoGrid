// server.js
const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv").config();
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const productRoutes = require('./routes/productRoutes'); // Add product routes
const multer = require("multer");

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

// Product routes
app.use('/api', productRoutes);  // Add product routes here

app.get("/", (req, res) => {
  res.send("Home page");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Image upload route using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // specify the folder where you want to save the images
  },
  filename: (req, file, cb) => {
    // Use the original file name, but add a timestamp to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); // Allow the file
  } else {
    cb(new Error("Invalid file type. Only images are allowed!"), false); // Reject the file
  }
};

// Create the multer upload instance with storage and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});