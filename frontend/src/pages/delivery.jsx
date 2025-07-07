import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/orders.css';

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [otpInputs, setOtpInputs] = useState({});
  const [verifyingOrderId, setVerifyingOrderId] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your deliveries');
          setLoading(false);
          return;
        }
        const response = await axios.get(`${API_URL}/api/orders/mydelivery`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setOrders(response.data.orders || []);
        } else {
          setError(response.data.message || 'Failed to fetch deliveries');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  const handleGenerateOtp = async (orderId) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to generate OTP');
        setLoading(false);
        return;
      }
      const response = await axios.post(`${API_URL}/api/orders/generateotp`, { orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        alert(`OTP generated successfully. Share with buyer: ${response.data.otp}`);
        setVerifyingOrderId(orderId);
      } else {
        setError(response.data.message || 'Failed to generate OTP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while generating OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInputChange = (orderId, value) => {
    setOtpInputs(prev => ({ ...prev, [orderId]: value }));
  };

  const handleVerifyOtp = async (orderId) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to verify OTP');
        setLoading(false);
        return;
      }
      const otp = otpInputs[orderId];
      if (!otp) {
        setError('Please enter OTP');
        setLoading(false);
        return;
      }
      const response = await axios.post(`${API_URL}/api/orders/verifyotp`, { orderId, otp }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSuccess('Order delivered successfully!');
        setVerifyingOrderId(null);
        setOtpInputs(prev => ({ ...prev, [orderId]: '' }));
        window.location.reload(); // Reload the page after successful OTP verification
      } else {
        setError(response.data.message || 'OTP verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="delivery-container">
      <div className="page-header">
        <h2>My Deliveries</h2>
        <p className="page-subtitle">Manage and track your product deliveries</p>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your deliveries...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <i className="success-icon">✅</i>
          {success}
        </div>
      )}
      
      {!loading && !error && orders.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No deliveries yet</h3>
          <p>You have no orders to deliver at the moment.</p>
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
                  <span className="detail-label">Buyer:</span>
                  <span className="detail-value">{order.buyer?.name || order.buyer}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Placed On:</span>
                  <span className="detail-value">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button className="otp-btn" onClick={() => handleGenerateOtp(order._id)}>
                  <span>🔐</span> Generate OTP
                </button>
                
                {verifyingOrderId === order._id && (
                  <div className="otp-verify-section">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ''}
                      onChange={e => handleOtpInputChange(order._id, e.target.value)}
                      className="otp-input"
                    />
                    <button className="verify-otp-btn" onClick={() => handleVerifyOtp(order._id)}>
                      <span>✅</span> Verify OTP
                    </button>
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

export default Delivery;
