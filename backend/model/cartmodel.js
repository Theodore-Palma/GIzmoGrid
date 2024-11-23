const mongoose = require('mongoose');

// Import Product model to reference it in Cart
const Product = require('./product'); // Adjust the path to your Product model

// Define the Cart schema
const CartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,  // Store the ObjectId of the Product
    ref: 'Product',                       // Reference the Product model
    required: true
  },
  email: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1, // Default quantity is 1, can be updated later
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
