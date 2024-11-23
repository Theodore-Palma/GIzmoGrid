const express = require('express');
const router = express.Router();
const Product = require('../model/product');

// Add a new product
router.post('/products', async (req, res) => {
  const { name, description, price, imageUrl, category } = req.body;
  try {
    const newProduct = new Product({ name, description, price, imageUrl, category });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

module.exports = router;
