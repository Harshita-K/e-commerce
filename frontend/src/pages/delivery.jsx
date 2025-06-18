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
        const response = await axios.get('http://localhost:8080/api/orders/mydelivery', {
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
      const response = await axios.post('http://localhost:8080/api/orders/generateotp', { orderId }, {
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
      const response = await axios.post('http://localhost:8080/api/orders/verifyotp', { orderId, otp }, {
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
    <div className="orders-container">
      <h2>My Deliveries</h2>
      {loading && <div className="loading">Loading deliveries...</div>}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="empty-message">You have no deliveries yet.</div>
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
              <div><strong>Buyer:</strong> {order.buyer?.name || order.buyer}</div>
              <div><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</div>
              <button className="otp-btn" onClick={() => handleGenerateOtp(order._id)}>
                Generate OTP
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
                    Verify OTP
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;
