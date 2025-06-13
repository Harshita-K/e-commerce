import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get('http://localhost:8080/api/products/dashboard', {
          headers
        });
        
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Available Products</h2>
      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="empty-message">No products available at the moment.</div>
      )}
      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            {product.image && (
              <img 
                src={product.image} 
                alt={product.name} 
                className="product-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-desc">{product.description}</p>
              <div className="product-meta">
                <span className="product-price">₹{product.price}</span>
                <span className="product-category">{product.category}</span>
              </div>
              <button className="buy-btn">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;