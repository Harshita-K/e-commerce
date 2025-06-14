import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const response = await axios.get('http://localhost:8080/api/products/shop', {
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

  const addToCart = async (productId) => {
    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to add items to cart');
        return;
      }

      const response = await axios.post('http://localhost:8080/api/products/addtocart', 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Product added to cart successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while adding to cart');
    }
  };

  return (
    <div className="shop-container">
      <h2>Available Products</h2>
      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
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
              <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;