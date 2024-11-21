// Pages/Admin.js
import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const Admin = () => {
  const { user } = useContext(ShopContext);
  const navigate = useNavigate();

  // Redirect if the user is not an admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Manage users and products here.</p>
      {/* Components for user management and product management can go here */}
    </div>
  );
};

export default Admin;
