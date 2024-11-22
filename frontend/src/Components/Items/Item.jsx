import React, { useState, useEffect } from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/products'; // Replace with your actual backend URL

const Item = () => {
    const [products, setProducts] = useState([]);

    // Fetch products data from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data); // Assuming the response contains an array of products
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []); // Empty dependency array ensures this runs once on component mount

    return (
        <div className="item-list">
            {products.map((product) => (
                <div key={product._id} className="item">
                    <Link to={`/product/${product._id}`}>
                        <img
                            onClick={window.scrollTo(0, 0)}
                            src={product.images[0]} // Assuming the first image in the array is the main image
                            alt={product.name}
                        />
                    </Link>
                    <p>{product.name}</p>

                    <div className="item-prices">
                        <div className="item-price-new">
                            ₱{product.price}
                        </div>

                        {product.old_price && (
                            <div className="item-price-old">
                                ₱{product.old_price}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Item;
