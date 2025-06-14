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

  return (
    <div className="cart-container">
      <h2>My Cart</h2>
      {loading && <div className="loading">Loading cart...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && cartItems.filter(item => item.product).length === 0 && (
        <div className="empty-message">Your cart is empty.</div>
      )}
      {!loading && !error && cartItems.filter(item => item.product).length > 0 && (
        <>
          <div className="cart-items">
            {cartItems.filter(item => item.product).map((item, index) => (
              <div className="cart-item" key={index}>
                {item.product.image && (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="cart-item-image"
                  />
                )}
                <div className="item-info">
                  <h4>{item.product.name}</h4>
                  <p className="item-description">{item.product.description}</p>
                  <p className="item-category">Category: {item.product.category}</p>
                  <p className="item-price">₹{item.product.price}</p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-total">Total: ₹{item.product.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total Items: {cartItems.filter(item => item.product).length}</h3>
            <h3>Total Amount: ₹{cartItems.filter(item => item.product).reduce((total, item) => total + (item.product.price * item.quantity), 0)}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;