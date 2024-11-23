const express = require('express');
const { addToCart, getCartItems } = require('../controllers/AddtocartController');  // Import both functions
const router = express.Router();

// Route to add a product to the cart
router.post('/add', addToCart);

// Route to fetch all cart items for a user
router.get('/cart/:email', getCartItems);  // Make sure to include the getCartItems route

module.exports = router;
