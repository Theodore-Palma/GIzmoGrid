// checkoutRoute.js

const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/CheckoutController');

// Checkout route
router.post('/checkout', CheckoutController.checkout);

// Import your controller function here

//Define the route with the imported controller
router.get('/checkouts', CheckoutController.getCheckouts);


// Update checkout status route
router.put('/update/:checkoutId', CheckoutController.updateStatus);

module.exports = router;