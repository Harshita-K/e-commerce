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
        // window.location.href = '/dashboard'; // Redirect to home page after login
        
        // Redirect to homepage or dashboard
        // Example if using react-router:
        navigate('/profile');
        
        alert('Login successful!');
      }
      else {
        console.error('Login failed:', response.data.message);
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      
      // Handle different types of errors
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Login failed: ${error.response.data.message || 'Invalid credentials'}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('Server not responding. Please try again later.');
      } else {
        // Something happened in setting up the request
        alert('Error during login. Please try again.');
      }
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