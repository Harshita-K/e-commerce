import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cartProductIds, setCartProductIds] = useState([]);
  const [orderedProductIds, setOrderedProductIds] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${API_URL}/api/products/shop`, { headers });
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          setError(response.data.message || 'Failed to fetch products');
        }
        // Fetch cart products if logged in
        if (token) {
          const cartRes = await axios.get(`${API_URL}/api/products/cart`, { headers });
          if (cartRes.data.success) {
            setCartProductIds((cartRes.data.cartdata || []).map(item => item.productId));
          }
          
          // Fetch user's orders to check which products are already ordered
          const ordersRes = await axios.get(`${API_URL}/api/orders/myorders`, { headers });
          if (ordersRes.data.success) {
            const orderedIds = ordersRes.data.orders.map(order => order.product?._id || order.product);
            setOrderedProductIds(orderedIds);
          }
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

      const response = await axios.post(`${API_URL}/api/products/addtocart`, 
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Product added to cart successfully!');
        setCartProductIds(prev => [...prev, productId]);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to add to cart');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while adding to cart');
    }
  };

  // Get unique categories from products
  const allCategories = Array.from(new Set(products.flatMap(p => {
    if (!p.category) return [];
    if (Array.isArray(p.category)) return p.category;
    if (typeof p.category === 'string') return p.category.split(',');
    return [];
  })));

  // Filter products by selected categories and search term
  const filteredProducts = products.filter(product => {
    // Filter by search term (name)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by categories
    const matchesCategory = selectedCategories.length === 0 || (() => {
      if (!product.category) return false;
      const productCategories = Array.isArray(product.category) 
        ? product.category 
        : typeof product.category === 'string' 
          ? product.category.split(',') 
          : [];
      return selectedCategories.some(cat => productCategories.includes(cat));
    })();
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container">
      <h2>Available Products</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filter */}
      <div className="category-filter-container">
        <label className="category-filter-label">Filter by Category:</label>
        <div className="category-checkboxes">
          {allCategories.map(cat => (
            <div key={cat} className="category-checkbox-item">
              <input
                type="checkbox"
                value={cat}
                checked={selectedCategories.includes(cat)}
                onChange={e => {
                  if (e.target.checked) {
                    setSelectedCategories(prev => [...prev, cat]);
                  } else {
                    setSelectedCategories(prev => prev.filter(c => c !== cat));
                  }
                }}
              />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="empty-message">No products found matching your search criteria.</div>
      )}
      <div className="products-grid">
        {filteredProducts.map(product => (
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
                <div className="product-categories">
                  {(() => {
                    if (!product.category) return null;
                    const categories = Array.isArray(product.category) 
                      ? product.category 
                      : typeof product.category === 'string' 
                        ? product.category.split(',').map(cat => cat.trim())
                        : [product.category];
                    return categories.map((cat, index) => (
                      <span key={index} className="product-category">{cat}</span>
                    ));
                  })()}
                </div>
              </div>
              {orderedProductIds.includes(product._id) ? (
                <button className="ordered-btn" disabled>Ordered</button>
              ) : cartProductIds.includes(product._id) ? (
                <button className="add-to-cart-btn" disabled>Added to Cart</button>
              ) : (
                <button className="add-to-cart-btn" onClick={() => addToCart(product._id)}>
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;