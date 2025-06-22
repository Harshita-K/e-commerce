import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { Link , NavLink} from 'react-router-dom'; // Add this import

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(''); // Clear previous errors
    setLoading(true);
    
    try {
      console.log('Logging in with:', formData)
      
      // API call using axios
      const response = await axios.post('http://localhost:8080/api/users/login', formData);
      
      // Handle successful login
      console.log('Login successful:', response.data);
      
      // Check if login was successful
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/');
      } else {
        // Handle unsuccessful login
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Display error message to user
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        
        {error && (
          <div className="error-message">
            <i className="error-icon">⚠️</i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="register-option">
            <p>Don't have an account? <Link to="/signin">Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login