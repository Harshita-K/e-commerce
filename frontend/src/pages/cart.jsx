import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please login to view your cart');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8080/api/products/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const cartData = response.data.cartdata || [];
          
          // Fetch product details for each cart item
          const cartWithProductDetails = await Promise.all(
            cartData.map(async (item) => {
              try {
                const productRes = await axios.get(`http://localhost:8080/api/products/${item.productId}`);
                if (productRes.data.success) {
                  return {
                    ...item,
                    product: productRes.data.product
                  };
                }
                return item;
              } catch (err) {
                console.error('Error fetching product details:', err);
                return item;
              }
            })
          );
          
          setCartItems(cartWithProductDetails);
        } else {
          setError(response.data.message || 'Failed to fetch cart');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to modify your cart');
        setLoading(false);
        return;
      }
      const response = await axios.post('http://localhost:8080/api/products/removefromcart', { productId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCartItems(prev => prev.filter(item => item.productId !== productId));
      } else {
        setError(response.data.message || 'Failed to remove item from cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while removing item');
    } finally {
      setLoading(false);
    }
  };

  const buyNow = async () => {
    try {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login to buy products');
        setLoading(false);
        return;
      }
      const productIds = cartItems.filter(item => item.product).map(item => item.productId);
      if (productIds.length === 0) {
        setError('No valid products in cart to buy');
        setLoading(false);
        return;
      }
      const response = await axios.post('http://localhost:8080/api/orders/buynow', { productIds }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCartItems([]);
      } else {
        setError(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <div className="page-header">
        <h2>My Cart</h2>
        <p className="page-subtitle">Review and manage your selected items</p>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      )}
      
      {!loading && !error && cartItems.filter(item => item.product).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart to get started!</p>
        </div>
      )}
      {!loading && !error && cartItems.filter(item => item.product).length > 0 && (
        <>
          <div className="cart-grid">
            {cartItems.filter(item => item.product).map((item, index) => (
              <div className="cart-card" key={index}>
                {item.product.image && Array.isArray(item.product.image) && item.product.image.length > 0 && item.product.image[0] ? (
                  <div className="cart-item-image-container">
                    <img src={item.product.image[0]} alt={item.product.name} className="cart-item-image" />
                  </div>
                ) : null}
                
                <div className="cart-item-content">
                  <div className="cart-item-header">
                    <h3 className="cart-item-name">{item.product.name}</h3>
                    <div className="cart-item-price">₹{item.product.price}</div>
                  </div>
                  
                  <p className="cart-item-description">{item.product.description || 'No description provided'}</p>
                  
                  {item.product.category && (
                    <div className="cart-item-category">
                      <span className="category-tag">{item.product.category}</span>
                    </div>
                  )}
                  
                  <div className="cart-item-details">
                    <div className="quantity-info">Quantity: {item.quantity}</div>
                    <div className="total-price">Total: ₹{item.product.price * item.quantity}</div>
                  </div>
                  
                  <div className="cart-item-actions">
                    <button className="remove-btn" onClick={() => removeFromCart(item.productId)}>
                      <span>🗑️</span> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Total Items:</span>
                  <span>{cartItems.filter(item => item.product).length}</span>
                </div>
                <div className="summary-row total-amount">
                  <span>Total Amount:</span>
                  <span>₹{cartItems.filter(item => item.product).reduce((total, item) => total + (item.product.price * item.quantity), 0)}</span>
                </div>
              </div>
              <button className="buy-btn" onClick={buyNow} disabled={cartItems.filter(item => item.product).length === 0 || loading}>
                <span>🛒</span> Buy Now
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;