import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import './CSS/AddProductForm.css';

const API_URL = 'http://localhost:4000/api/products'; // Replace with your actual backend URL
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfqapplee/upload'; // Your Cloudinary URL
const UPLOAD_PRESET = 'y4zsglfn'; // Your Cloudinary upload preset

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    images: [],
    category: '', // Updated category state
  });
  const [imageFiles, setImageFiles] = useState([]); // Track selected image files
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editMode, setEditMode] = useState(false); // Edit mode flag
  const [currentProductId, setCurrentProductId] = useState(null); // Current product ID for editing

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
  };

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setLoading(false);
    }
  };

  // Upload images to Cloudinary
  const uploadImagesToCloudinary = async () => {
    const uploadedImages = [];
    for (const file of imageFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
        const response = await axios.post(CLOUDINARY_URL, formData);
        uploadedImages.push(response.data.secure_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    return uploadedImages;
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload images first
      const uploadedImages = await uploadImagesToCloudinary();

      // Add uploaded images to form data
      const newFormData = {
        ...formData,
        images: uploadedImages,
      };

      // Save product data to the backend
      const response = await axios.post(API_URL, newFormData);
      alert('Product added successfully');
      setProducts([...products, response.data.product]);
      setFormData({
        name: '',
        description: '',
        price: '',
        images: [],
        category: '',
      });
      setImageFiles([]);
    } catch (error) {
      alert('Error adding product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Upload images if new ones are selected
      const uploadedImages = await uploadImagesToCloudinary();

      // Combine old and new images
      const updatedFormData = {
        ...formData,
        images: uploadedImages.length > 0 ? uploadedImages : formData.images, // Keep old images if no new images are uploaded
      };
  
      // Update product in the backend
      const response = await axios.put(`${API_URL}/${currentProductId}`, updatedFormData);
      alert('Product updated successfully');
      setProducts(
        products.map((product) =>
          product._id === currentProductId ? response.data.product : product
        )
      );
      setFormData({
        name: '',
        description: '',
        price: '',
        images: [],
        category: '',
      });
      setImageFiles([]);
      setEditMode(false);
      setCurrentProductId(null);
    } catch (error) {
      alert('Error updating product');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle row selection for bulk delete
  const handleRowSelection = (rowsSelected) => {
    const ids = rowsSelected.map((rowIndex) => products[rowIndex]._id);
    setSelectedRows(ids);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setLoading(true);
    try {
      await Promise.all(selectedRows.map((id) => axios.delete(`${API_URL}/${id}`)));
      alert('Selected products deleted successfully');
      setProducts(products.filter((product) => !selectedRows.includes(product._id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting products', error);
      alert('Error deleting products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    { name: 'name', label: 'Name' },
    { name: 'price', label: 'Price', options: { customBodyRender: (value) => `₱${value}` } },
    { name: 'category', label: 'Category' },
    {
      name: 'images',
      label: 'Images',
      options: {
        customBodyRender: (value) => (
          <div style={{ display: 'flex', gap: '10px' }}>
            {value.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product ${index}`}
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>
        ),
      },
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        customBodyRender: (_, tableMeta) => {
          const product = products[tableMeta.rowIndex];
          return (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setFormData({
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  images: product.images,
                  category: product.category,
                });
                setEditMode(true);
                setCurrentProductId(product._id);
              }}
            >
              Edit
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    selectableRows: 'multiple',
    onRowsSelect: (rowsSelected) => handleRowSelection(rowsSelected.map((r) => r.dataIndex)),
    customToolbarSelect: () => (
      <Button
        onClick={handleBulkDelete}
        disabled={loading || selectedRows.length === 0}
        color="secondary"
        variant="contained"
      >
        Delete Selected
      </Button>
    ),
  };

  return (
    <div className="product-form-container">
      <h2>{editMode ? 'Update Product' : 'Add Product'}</h2>
      <form
        onSubmit={editMode ? handleUpdateProduct : handleAddProduct}
        className="product-form"
      >
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          type="number"
          fullWidth
          required
          margin="normal"
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ margin: '10px 0' }}
        />
        
        {/* Category dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
          >
            <MenuItem value="Laptops">Laptops</MenuItem>
            <MenuItem value="Computers">Computers</MenuItem>
            <MenuItem value="Smartphones">Smartphones</MenuItem>
          </Select>
        </FormControl>

        <Button type="submit" disabled={loading} variant="contained" color="primary" fullWidth>
          {loading
            ? editMode
              ? 'Updating Product...'
              : 'Adding Product...'
            : editMode
            ? 'Update Product'
            : 'Add Product'}
        </Button>
      </form>

      <h2>Product List</h2>
      <MUIDataTable
        title="Product List"
        data={products}
        columns={columns}
        options={options}
      />
    </div>
  );
};

export default AddProductForm;
