import React, { useState, useEffect } from 'react';
import './ProductDisplay.css'; // Style the product list as needed
import { Link } from 'react-router-dom'; // For linking to individual product pages
import axios from 'axios'; // For making API requests

const ProductList = () => {
    const [products, setProducts] = useState([]); // State to hold product data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:4000/api/products/`);
                setProducts(response.data); // Set products in state
            } catch (err) {
                console.error(err);
                setError('Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (products.length === 0) {
        return <div>No products available</div>;
    }

    return (
        <div className="product-list">
            {products.map((product) => (
                <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`}>
                        <img src={product.images[0]} alt={product.name} className="product-image" />
                    </Link>
                    <div className="product-details">
                        <h3>{product.name}</h3>
                        <p>₱{product.price.toFixed(2)}</p>
                        <Link to={`/product/${product._id}`} className="view-details">
                            View Details
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductList;
