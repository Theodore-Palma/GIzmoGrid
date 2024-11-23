import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Grid, Card, CardContent, Typography, Button, TextField, CircularProgress, Alert } from '@mui/material';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]); // Cart items state
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch cart items on component mount
    useEffect(() => {
        const fetchCartItems = async () => {
            const lastLoggedInUser = JSON.parse(localStorage.getItem('lastLoggedInUser'));

            if (!lastLoggedInUser || !lastLoggedInUser.email) {
                alert('Please log in first.');
                return;
            }

            const email = lastLoggedInUser.email;

            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/cart/${email}`);
                setCartItems(response.data);
            } catch (err) {
                setError('Failed to load cart items');
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    // Update the quantity in the cart
    const updateQuantity = async (cartItemId, newQuantity) => {
        try {
            const response = await axios.put(`http://localhost:4000/api/cart/update/${cartItemId}`, {
                quantity: newQuantity,
            });
            setCartItems(response.data); // Update cart after quantity change
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Failed to update quantity.');
        }
    };

    // Remove item from cart
    const removeFromCart = async (cartItemId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/api/cart/remove/${cartItemId}`);
            setCartItems(response.data); // Remove the item from the cart
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Failed to remove item from cart.');
        }
    };

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!cartItems.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="warning">Your cart is empty</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            <Grid container spacing={2}>
                {cartItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
                        <Card sx={{ padding: 2 }}>
                            <CardContent>
                                <Typography variant="h6">{item.product.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.product.description}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                                    <TextField
                                        type="number"
                                        label="Quantity"
                                        value={item.quantity}
                                        onChange={(e) =>
                                            updateQuantity(item._id, Math.max(1, e.target.value))
                                        }
                                        inputProps={{
                                            min: 1,
                                            max: item.product.stock,
                                        }}
                                    />
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: '600' }}>
                                        ₱{(item.product.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box mt={2}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => removeFromCart(item._id)}
                                        sx={{ width: '100%' }}
                                    >
                                        Remove from Cart
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Box mt={4} display="flex" justifyContent="flex-end">
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Total: ₱{calculateTotal()}
                </Typography>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" sx={{ padding: '10px 20px' }}>
                    Proceed to Checkout
                </Button>
            </Box>
        </Box>
    );
};

export default Cart;
