import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, List, ListItem, Typography, Button, TextField } from '@mui/material';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      const lastLoggedInUser = JSON.parse(localStorage.getItem('lastLoggedInUser'));

      if (!lastLoggedInUser || !lastLoggedInUser.email) {
        setError('No user found in localStorage. Please log in first.');
        return;
      }

      const email = lastLoggedInUser.email;

      try {
        const response = await axios.get(`http://localhost:4000/api/cart/cart/${email}`);
        setCartItems(response.data.cartItems);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch cart items');
      }
    };

    fetchCartItems();
  }, []);

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate total price
  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.product.price * item.quantity, 0)
      .toFixed(2);
  };

  // Handle checkout
  const handleCheckout = async () => {
    const lastLoggedInUser = JSON.parse(localStorage.getItem('lastLoggedInUser'));

    if (!lastLoggedInUser || !lastLoggedInUser.email) {
      setCheckoutError('No user found in localStorage. Please log in first.');
      return;
    }

    const email = lastLoggedInUser.email;
    const cartData = {
      email,
    };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/checkout/checkout', cartData);

      if (response.status === 200) {
        // Clear the cart after successful checkout (optional)
        setCartItems([]);
        alert('Checkout successful');
      }
    } catch (error) {
      console.error(error);
      setCheckoutError('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 800,
        margin: '0 auto',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 3,
        }}
      >
        Your Cart
      </Typography>
      {cartItems.length === 0 ? (
        <Typography textAlign="center">No items in your cart</Typography>
      ) : (
        <List>
          {cartItems.map((item) => (
            <ListItem
              key={item._id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 2,
                marginBottom: 2,
                backgroundColor: '#fff',
                borderRadius: 2,
                boxShadow: 1,
              }}
            >
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">
                  {item.product ? item.product.name : 'Unknown Product'}
                </Typography>
                <Typography color="text.secondary">
                  ₱{item.product ? item.product.price.toFixed(2) : 'N/A'}
                </Typography>
              </Box>
              <TextField
                type="number"
                variant="outlined"
                size="small"
                value={item.quantity}
                onChange={(e) =>
                  handleQuantityChange(item._id, parseInt(e.target.value))
                }
                sx={{
                  width: 80,
                  marginRight: 2,
                }}
                inputProps={{
                  min: 1,
                }}
              />
              <Typography
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                }}
              >
                ₱{(item.product.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 3,
          paddingTop: 2,
          borderTop: '2px solid #ddd',
        }}
      >
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          ₱{calculateTotal()}
        </Typography>
      </Box>
      {checkoutError && (
        <Typography color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
          {checkoutError}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          marginTop: 3,
          padding: 1.5,
          fontSize: '1rem',
          borderRadius: 2,
        }}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>
    </Box>
  );
};

export default Cart;
