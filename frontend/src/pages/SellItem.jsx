import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/sellItem.css'; // Assuming you have a CSS file for styling

const CATEGORY_OPTIONS = [
  'sports', 'electronics', 'clothing', 'books', 'furniture', 'toys', 'food', 'other'
];

const SellItem = () => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      // Decode user id from token (or get from backend/profile if you have user context)
      // For simplicity, let's fetch user id from profile endpoint
      const userRes = await axios.get('http://localhost:8080/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const owner = userRes.data.user?._id;
      if (!owner) {
        setError('Could not determine user.');
        return;
      }
      const payload = {
        ...form,
        price: Number(form.price),
        owner,
        category: form.category ? form.category.split(',') : []
    };
      const res = await axios.post('http://localhost:8080/api/products/sell', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setSuccess('Product listed successfully!');
        setForm({ name: '', description: '', price: '', image: '', category: '' });
      } else {
        setError(res.data.message || 'Failed to list product');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="sell-item-container">
      <h2>Sell an Item</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form className="sell-item-form" onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <div>
          <label>Price</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" />
        </div>
        <div>
          <label>Image URL</label>
          <input type="text" name="image" value={form.image} onChange={handleChange} />
        </div>
        <div>
          <label>Category</label>
          <div className="category-checkboxes">
            {CATEGORY_OPTIONS.map(option => (
              <label key={option}>
                <input
                  type="checkbox"
                  name="category"
                  value={option}
                  checked={form.category.split(',').includes(option)}
                  onChange={e => {
                    let newCategories = form.category ? form.category.split(',') : [];
                    if (e.target.checked) {
                      newCategories.push(option);
                    } else {
                      newCategories = newCategories.filter(cat => cat !== option);
                    }
                    setForm(prev => ({ ...prev, category: newCategories.join(',') }));
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit">List Product</button>
      </form>
    </div>
  );
};

export default SellItem;
