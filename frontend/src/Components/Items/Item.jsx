import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
    TextField,
} from '@mui/material';

const Item = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:4000/api/products/');
                
                // Filter out duplicates based on product ID
                const uniqueProducts = Array.from(
                    new Map(response.data.map(item => [item._id, item])).values()
                );
                
                setProducts(uniqueProducts);
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
            [productId]: Math.max(1, parseInt(quantity, 10) || 1), // Ensure quantity is at least 1
        }));
    };

    const addToCart = async (product) => {
        const lastLoggedInUser = JSON.parse(localStorage.getItem('lastLoggedInUser'));

        if (!lastLoggedInUser || !lastLoggedInUser.email) {
            alert('Please log in to add items to your cart.');
            return;
        }

        const email = lastLoggedInUser.email;
        const quantity = quantities[product._id] || 1;

        try {
            const response = await axios.post('http://localhost:4000/api/cart/add', {
                product,
                email,
                quantity,
            });

            alert(`Added ${quantity} ${product.name}(s) to your cart!`);
        } catch (error) {
            console.error('Error adding product to cart:', error);
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
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid item key={product._id} xs={12} sm={6} md={3}> {/* 4 products per row on medium screens */}
                        <Card sx={{ maxWidth: 320, margin: 'auto', borderRadius: 1 }}>
                            <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={product.images[0]}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                />
                            </Link>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    {product.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: '14px', marginBottom: '8px' }}
                                >
                                    {product.description}
                                </Typography>
                                <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                                    <Typography variant="h6" color="primary" sx={{ fontWeight: '600' }}>
                                        ₱{product.price.toFixed(2)}
                                    </Typography>
                                </Box>
                                <Box mt={2}>
                                    <TextField
                                        type="number"
                                        value={quantities[product._id] || 1}
                                        onChange={(e) =>
                                            handleQuantityChange(product._id, e.target.value)
                                        }
                                        inputProps={{ min: 1 }}
                                        size="small"
                                        sx={{ width: '80px', textAlign: 'center' }}
                                    />
                                </Box>
                                <Box mt={2}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => addToCart(product)}
                                        sx={{
                                            padding: '10px 20px',
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            textTransform: 'none',
                                            width: '100%',
                                        }}
                                    >
                                        Add to Cart
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
