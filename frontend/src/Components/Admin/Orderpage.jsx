// src/Components/Admin/Orderpage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import './Orderpage.css';  // Importing CSS file

const Orderpage = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/checkout/checkouts');
        setCheckouts(response.data.checkouts);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch checkouts');
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  // Handle status change
  const handleStatusChange = (checkoutId, newStatus) => {
    setSelectedStatus(newStatus);
    setUpdatingStatus(checkoutId);
  };

  // Handle status update to the backend
  const handleUpdateStatus = async (checkoutId) => {
    if (!selectedStatus) {
      setError('Please select a status.');
      return;
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/checkout/update/${checkoutId}`, { status: selectedStatus });
      console.log('Status updated:', response.data);

      // Refresh data after update
      const updatedCheckouts = checkouts.map((checkout) => {
        if (checkout._id === checkoutId) {
          return { ...checkout, status: selectedStatus }; // Update status in the state
        }
        return checkout;
      });
      setCheckouts(updatedCheckouts);
      setSelectedStatus(''); // Reset the selected status
      setUpdatingStatus(null); // Reset the updating status
    } catch (error) {
      console.error(error);
      setError('Failed to update status');
    }
  };

  // Prepare data for MUI DataTable
  const data = checkouts.map((checkout) => {
    return [
      checkout._id,
      checkout.email,
      checkout.totalAmount.toFixed(2),
      checkout.cartItems.map(item => `${item.product.name} (x${item.quantity})`).join(', '),
      (
        <FormControl>
          <Select
            value={updatingStatus === checkout._id ? selectedStatus : checkout.status}
            onChange={(e) => handleStatusChange(checkout._id, e.target.value)}
            enable={updatingStatus !== checkout._id} // Disabled if not updating this checkout
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
          </Select>
        </FormControl>
      ),
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleUpdateStatus(checkout._id)}
        enable={updatingStatus !== checkout._id || !selectedStatus} // Disable if not updating or status is not selected
      >
        Update
      </Button>,
    ];
  });

  // Columns for MUI DataTable
  const columns = [
    { name: 'Checkout ID', options: { filter: true } },
    { name: 'Email', options: { filter: true } },
    { name: 'Total Amount', options: { filter: true } },
    { name: 'Products', options: { filter: false } },
    { name: 'Status', options: { filter: true } },
    { name: 'Action', options: { filter: false, sort: false } },  // Update action column
  ];

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    rowsPerPage: 5,
    selectableRows: 'none',
  };

  return (
    <Box className="order-container">
      <Typography className="title" variant="h4" gutterBottom>
        Order History
      </Typography>

      {error && <Typography className="error-message">{error}</Typography>}

      <div className="data-table-container">
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <MUIDataTable
            title={'Checkout Orders'}
            data={data}
            columns={columns}
            options={options}
          />
        )}
      </div>
    </Box>
  );
};

export default Orderpage;
