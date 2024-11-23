const express = require("express");
const app = express();
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv").config();
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const productRoutes = require('./routes/productRoutes'); // Add product routes
const multer = require("multer");
const cors = require('cors');
const cartRoute = require('./routes/cartroute'); // Adjust path as needed

// Enable CORS for all origins
app.use(cors());  

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
app.use('/api', productRoutes);  // Product routes
app.use('/api/cart', cartRoute);

app.get("/", (req, res) => {
  res.send("Home page");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
