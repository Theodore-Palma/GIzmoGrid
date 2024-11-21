import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/products', { name, price, image })
      .then(() => {
        alert('Product added successfully!');
        navigate('/admin');
      })
      .catch(error => console.error('Error adding product:', error));
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <label>Image URL</label>
        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
