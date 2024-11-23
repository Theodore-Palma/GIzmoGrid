import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Item.css';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';

const Item = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});  // Add state for quantities

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:4000/api/products/');
                console.log('Fetched products:', response.data);
                setProducts(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleQuantityChange = (productId, quantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max(1, quantity), // Ensure quantity is at least 1
        }));
    };

    const addToCart = async (product) => {
        const lastLoggedInUser = JSON.parse(localStorage.getItem('lastLoggedInUser'));
        
        if (!lastLoggedInUser || !lastLoggedInUser.email) {
            alert('No user found in localStorage. Please log in first.');
            return;
        }

        const email = lastLoggedInUser.email;
        const quantity = quantities[product._id] || 1; // Get selected quantity or default to 1

        try {
            const response = await axios.post('http://localhost:4000/api/cart/add', {
                product,
                email,
                quantity,
            });

            console.log(response.data);
            alert(`Added ${quantity} ${product.name}(s) to cart!`);
        } catch (error) {
            console.error('Error adding product to cart:', error);

            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
            }

            alert('Failed to add product to cart.');
        }
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

    if (!products.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Alert severity="warning">No products available</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Grid container spacing={2} justifyContent="center">
                {products.slice(0, 8).map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <Card sx={{ width: '100%', maxWidth: 320, margin: 'auto', borderRadius: 1 }}>
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={product.images[0]}
                                    alt={product.name}
                                    sx={{
                                        cursor: 'pointer',
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                    }}
                                    onClick={() => window.scrollTo(0, 0)}
                                />
                            </Link>
                            <CardContent sx={{ textAlign: 'center', padding: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px', marginBottom: '8px' }}>
                                    {product.description}
                                </Typography>
                                <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: '600' }}>
                                        ₱{product.price.toFixed(2)}
                                    </Typography>
                                    {product.old_price && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textDecoration: 'line-through', fontSize: '14px' }}
                                        >
                                            ₱{product.old_price.toFixed(2)}
                                        </Typography>
                                    )}
                                </Box>
                                
                                {/* Quantity input */}
                                <Box mt={2} display="flex" justifyContent="center" alignItems="center">
                                    <input
                                        type="number"
                                        value={quantities[product._id] || 1}  // Use quantity or default to 1
                                        onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                        min="1"
                                        max={product.stock}  // Limit max to stock
                                        style={{ width: '50px', textAlign: 'center' }}
                                    />
                                </Box>

                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color={product.stock > 0 ? 'primary' : 'secondary'}
                                        disabled={product.stock === 0}
                                        onClick={() => addToCart(product)}
                                        sx={{
                                            padding: '10px 20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            width: '100%',
                                        }}
                                    >
                                        {product.stock > 0 ? 'Add to Cart' : 'Order Now!'}
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Item;
