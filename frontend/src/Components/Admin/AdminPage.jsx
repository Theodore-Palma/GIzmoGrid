import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
    images: []
  });
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  // Fetch users and products
  useEffect(() => {
    axios
      .get("/api/users")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    axios
      .get("/api/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload (example)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: files.map((file) => ({
        public_id: "", // public_id will be from an image service like Cloudinary
        url: URL.createObjectURL(file),
      })),
    });
  };

  // Add or Edit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, description, price, category, images } = formData;

    const productData = {
      name,
      description,
      price,
      category,
      images,  // Assumed images will be uploaded via a service like Cloudinary
    };

    if (isEdit) {
      try {
        await axios.put(`/api/products/${id}`, productData);
        setProducts((prev) =>
          prev.map((product) =>
            product.id === id ? { ...product, ...productData } : product
          )
        );
        setIsEdit(false);
        setFormData({ id: "", name: "", description: "", price: "", category: "", images: [] });
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      try {
        const response = await axios.post("/api/products", productData);
        setProducts([...products, response.data]);
        setFormData({ id: "", name: "", description: "", price: "", category: "", images: [] });
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setFormData(product);
    setIsEdit(true);
  };

  // Bulk delete products
  const handleBulkDelete = async () => {
    try {
      await axios.delete("/api/products", { data: { ids: selectedProducts } });
      setProducts((prev) =>
        prev.filter((product) => !selectedProducts.includes(product.id))
      );
      setSelectedProducts([]);
    } catch (error) {
      console.error("Error bulk deleting products:", error);
    }
  };

  // Handle checkbox selection
  const handleSelect = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Delete user
  const handleDeleteUser = (userId) => {
    axios
      .delete(`/api/users/${userId}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error("Error deleting user:", error));
  };

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* User Management */}
      <div className="section">
        <h2>User Management</h2>
        <button onClick={() => navigate("/admin/add-user")}>Add User</button>
        <div className="users-list">
          {users.map((user) => (
            <div key={user.id} className="user-item">
              <p>
                {user.name} ({user.email})
              </p>
              <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      {/* Product Management */}
      <div className="section">
        <h2>Product Management</h2>

        {/* Add/Edit Form */}
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Product Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Product Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <input
            type="text"
            name="category"
            placeholder="Product Category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <button type="submit">
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* Product List */}
        <div className="admin-product-list">
          <table>
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedProducts(
                        e.target.checked ? products.map((p) => p.id) : []
                      )
                    }
                    checked={selectedProducts.length === products.length && products.length > 0}
                  />
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelect(product.id)}
                    />
                  </td>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>₱{product.price}</td>
                  <td>{product.category}</td>
                  <td>
                    <button onClick={() => handleEdit(product)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bulk Delete Button */}
        {selectedProducts.length > 0 && (
          <button className="bulk-delete" onClick={handleBulkDelete}>
            Bulk Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
