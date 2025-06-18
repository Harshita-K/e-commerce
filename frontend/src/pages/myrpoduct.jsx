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
      <h2>My Products</h2>
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="empty-message">You have not listed any products yet.</div>
      )}
      <div className="products-grid">
        {products.map(product => (
          <div className="product-card" key={product._id}>
            {editingProduct === product._id ? (
              <form className="edit-product-form" onSubmit={handleEditSubmit}>
                <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required />
                <textarea name="description" value={editForm.description} onChange={handleEditChange} />
                <input type="number" name="price" value={editForm.price} onChange={handleEditChange} required min="0" />
                <input type="text" name="image" value={editForm.image} onChange={handleEditChange} />
                <input type="text" name="category" value={editForm.category} onChange={handleEditChange} />
                <div className="edit-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                {product.image && <img src={product.image} alt={product.name} className="product-image" />}
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-meta">
                    <span className="product-price">₹{product.price}</span>
                    <span className="product-category">{product.category}</span>
                  </div>
                  <button className="edit-btn" onClick={() => handleEditClick(product)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProduct;
