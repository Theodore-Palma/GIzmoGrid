// CheckoutController.js
const Cart = require('../model/cartmodel');  // Import Cart model
const Checkout = require('../model/checkoutmodel');  // Import Checkout model

// Checkout controller to handle checkout process
exports.checkout = async (req, res) => {
  try {
    const email = req.body.email || req.session.email; // Get email from request or session
    if (!email) {
      return res.status(400).json({ message: 'Please login first.' });
    }

    // Retrieve the user's cart items from the Cart collection
    const cartItems = await Cart.find({ email }).populate('product');
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }

    // Calculate total price
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.product.price * item.quantity;
    });

    // Create the Checkout entry with 'Pending' status by default
    const checkout = new Checkout({
      email,
      cartItems: cartItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      status: 'Pending',  // Set default status to 'Pending'
    });

    // Save the checkout
    await checkout.save();

    // Optionally, remove items from the cart after checkout (optional)
    await Cart.deleteMany({ email });

    res.status(200).json({ message: 'Checkout successful', checkout });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during checkout' });
  }
};


// Update checkout status
exports.updateStatus = async (req, res) => {
  try {
    const { checkoutId } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Delivered'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Update the status of the checkout
    const checkout = await Checkout.findByIdAndUpdate(
      checkoutId,
      { status },
      { new: true }
    );

    if (!checkout) {
      return res.status(404).json({ message: 'Checkout not found' });
    }

    res.status(200).json({ message: 'Status updated', checkout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during status update' });
  }
};

// Retrieve all checkouts or filter based on user email

exports.getCheckouts = async (req, res) => {
  try {
    // Fetch all checkouts from the database, populating cartItems.product
    const checkouts = await Checkout.find({}).populate('cartItems.product');

    if (!checkouts.length) {
      return res.status(404).json({ message: 'No checkouts found' });
    }

    res.status(200).json({ message: 'Checkouts retrieved successfully', checkouts });
  } catch (error) {
    console.error('Error in getCheckouts:', error);
    res.status(500).json({ message: 'Server error while retrieving checkouts', error: error.message });
  }
};

