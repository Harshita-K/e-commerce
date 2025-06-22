import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your orders');
          setLoading(false);
          return;
        }
        const response = await axios.get('http://localhost:8080/api/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <div className="page-header">
        <h2>My Orders</h2>
        <p className="page-subtitle">Track and manage your order history</p>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      )}
      
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet.</p>
        </div>
      )}
      <div className="orders-grid">
        {orders.map(order => (
          <div className="order-card" key={order._id}>
            {order.product?.image && Array.isArray(order.product.image) && order.product.image.length > 0 && order.product.image[0] && (
              <div className="order-product-image-container">
                <img src={order.product.image[0]} alt={order.product?.name || 'Product'} className="order-product-image" />
              </div>
            )}
            
            <div className="order-content">
              <div className="order-header">
                <h3 className="order-title">Order #{order._id.slice(-8)}</h3>
                <div className="order-status">{order.status}</div>
              </div>
              
              <div className="order-details">
                <div className="detail-row">
                  <span className="detail-label">Transaction ID:</span>
                  <span className="detail-value">{order.transactionId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Product:</span>
                  <span className="detail-value">{order.product?.name || order.product}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">₹{order.price}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Seller:</span>
                  <span className="detail-value">{order.seller?.name || order.seller}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Placed On:</span>
                  <span className="detail-value">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
                {order.otp && (
                  <div className="detail-row">
                    <span className="detail-label">OTP:</span>
                    <span className="detail-value otp-value">{order.otp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
