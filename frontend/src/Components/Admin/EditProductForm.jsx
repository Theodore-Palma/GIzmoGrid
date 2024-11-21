import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditProductForm = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({ name: '', price: '', image: '' });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${id}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`/api/products/${id}`, product)
      .then(() => {
        alert('Product updated successfully!');
        navigate('/admin');
      })
      .catch(error => console.error('Error updating product:', error));
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <label>Product Name</label>
        <input type="text" value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} required />
        <label>Price</label>
        <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} required />
        <label>Image URL</label>
        <input type="text" value={product.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} required />
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProductForm;
