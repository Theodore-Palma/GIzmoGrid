    // routes/productRoutes.js
    const express = require('express');
    const router = express.Router();
    const {
    addProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
    } = require('../controllers/productController');

    // Add a new product
    router.post('/products', addProduct);

    // Get all products
    router.get('/products', getProducts);

    // Get a product by ID
    router.get('/:id', getProductById);

    // Update a product
    router.put('/products/:id', updateProduct); // Corrected endpoint

    // Delete a product
    router.delete('/products/:id', deleteProduct);

    module.exports = router;
