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
      <h2>My Orders</h2>
      {loading && <div className="loading">Loading orders...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-message">You have not placed any orders yet.</div>
      )}
      <div className="orders-list">
        {orders.map(order => (
          <div className="order-card" key={order._id}>
            <div className="order-info">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Transaction ID:</strong> {order.transactionId}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Product:</strong> {order.product?.name || order.product}</div>
              <div><strong>Price:</strong> ₹{order.price}</div>
              <div><strong>Seller:</strong> {order.seller?.name || order.seller}</div>
              <div><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
