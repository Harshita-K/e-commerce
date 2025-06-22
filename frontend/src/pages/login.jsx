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
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  
  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      console.log('Logging in with:', formData)
      
      // API call using axios
      const response = await axios.post('http://localhost:8080/api/users/login', formData);
      
      // Handle successful login
      console.log('Login successful:', response.data);
      
      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        // window.location.href = '/shop'; // Redirect to home page after login
        
        // Redirect to homepage or shop
        // Example if using react-router:
        navigate('/');
      }
      else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
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
          <button type="submit" className="login-button">
            Login
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