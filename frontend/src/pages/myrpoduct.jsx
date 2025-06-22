import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/myrpoduct.css';

const MyProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', image: '', category: '' });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) return setError('Not logged in');
        // Get user id from profile endpoint
        const userRes = await axios.get('http://localhost:8080/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userId = userRes.data.user?._id;
        if (!userId) return setError('Could not determine user.');
        // Fetch products for this user
        const res = await axios.get(`http://localhost:8080/api/products/myproduct?userId=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          setError(res.data.message || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      image: product.image || '',
      category: product.category || ''
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return setError('Not logged in');
      const res = await axios.put(`http://localhost:8080/api/products/${editingProduct}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProducts(products.map(p => p._id === editingProduct ? res.data.product : p));
        setEditingProduct(null);
      } else {
        setError(res.data.message || 'Failed to update product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      if (!token) return setError('Not logged in');
      const res = await axios.delete(`http://localhost:8080/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setProducts(products.filter(p => p._id !== productId));
      } else {
        setError(res.data.message || 'Failed to delete product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting product');
    }
  };

  return (
    <div className="my-products-container">
      <div className="page-header">
        <h2>My Products</h2>
        <p className="page-subtitle">Manage your listed products</p>
      </div>
      
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your products...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <i className="error-icon">⚠️</i>
          {error}
        </div>
      )}
      
      {!loading && !error && products.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h3>No products yet</h3>
          <p>You haven't listed any products. Start selling by adding your first product!</p>
        </div>
      )}
      
      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            {editingProduct === product._id ? (
              <div className="edit-product-container">
                <div className="edit-header">
                  <h4>Edit Product</h4>
                </div>
                <form className="edit-product-form" onSubmit={handleEditSubmit}>
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={editForm.name} 
                      onChange={handleEditChange} 
                      placeholder="Enter product name"
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      value={editForm.description} 
                      onChange={handleEditChange}
                      placeholder="Describe your product"
                      rows="3"
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input 
                        type="number" 
                        name="price" 
                        value={editForm.price} 
                        onChange={handleEditChange}
                        placeholder="0"
                        required 
                        min="0" 
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Category</label>
                      <input 
                        type="text" 
                        name="category" 
                        value={editForm.category} 
                        onChange={handleEditChange}
                        placeholder="e.g., Electronics"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Image URL</label>
                    <input 
                      type="text" 
                      name="image" 
                      value={editForm.image} 
                      onChange={handleEditChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="edit-actions">
                    <button type="submit" className="save-btn">
                      <span>💾</span> Save Changes
                    </button>
                    <button type="button" className="cancel-btn" onClick={handleCancelEdit}>
                      <span>❌</span> Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="product-display">
                {product.image && Array.isArray(product.image) && product.image.length > 0 && product.image[0] ? (
                  <div className="product-image-container">
                    <img src={product.image[0]} alt={product.name} className="product-image" />
                    <div className="product-status">
                      <span className="status-badge">{product.status || 'Available'}</span>
                    </div>
                  </div>
                ) : null}
                
                <div className="product-content">
                  <div className="product-header">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-price">₹{product.price}</div>
                  </div>
                  
                  <p className="product-description">{product.description || 'No description provided'}</p>
                  
                  {product.category && (
                    <div className="product-category">
                      <span className="category-tag">{product.category}</span>
                    </div>
                  )}
                  
                  <div className="product-actions">
                    <button className="edit-btn" onClick={() => handleEditClick(product)}>
                      <span>✏️</span> Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>
                      <span>🗑️</span> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProduct;
