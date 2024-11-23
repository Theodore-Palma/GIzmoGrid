const Cart = require('../model/cartmodel'); // Adjust the model path if needed
const Product = require('../model/product'); // Import the Product model

// Add product to the cart
const addToCart = async (req, res) => {
    const { product, email, quantity } = req.body;

    // Ensure product, email, and quantity are provided
    if (!product || !email || quantity === undefined) {
        return res.status(400).json({ message: 'Product, email, and quantity are required' });
    }

    try {
        // Find if the user already has the product in their cart
        const existingCartItem = await Cart.findOne({ product, email });

        if (existingCartItem) {
            // If the product is already in the cart, update the quantity
            existingCartItem.quantity += quantity;
            await existingCartItem.save();

            // Populate the product field to return the full product details
            await existingCartItem.populate('product');

            return res.status(200).json({
                message: 'Product quantity updated in cart',
                cartItem: existingCartItem,
            });
        }

        // If the product is not in the cart, create a new cart item
        const newCartItem = new Cart({ product, email, quantity });
        await newCartItem.save();

        // Populate the product field to return the full product details
        await newCartItem.populate('product');

        return res.status(201).json({
            message: 'Product added to cart successfully',
            cartItem: newCartItem,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
// Fetch all cart items for a user
const getCartItems = async (req, res) => {
    const { email } = req.params;  // Get the email from the route parameters
    console.log('Fetching cart items for:', email);  // Log the email

    // Ensure email is provided
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        // Find all cart items for the user
        const cartItems = await Cart.find({ email }).populate('product');  // Populate to include product details

        console.log('Found cart items:', cartItems);  // Log the found items

        if (cartItems.length === 0) {
            return res.status(404).json({ message: 'No items in the cart' });
        }

        return res.status(200).json({
            message: 'Cart items fetched successfully',
            cartItems,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { addToCart, getCartItems }
