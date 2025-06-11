import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import { Link , NavLink} from 'react-router-dom';

const Profile = () => {
  console.log("Profile component loaded");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log("Token exists:", !!token);
        
        if (!token) {
          // Redirect to login if no token exists
          navigate('/login');
          return;
        }

        // Make request to backend with token in headers
        console.log("Making API request to profile endpoint...");
        const response = await axios.get('http://localhost:8080/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("API Response:", response.data);

        if (response.data && response.data.success) {
          console.log("User data:", response.data.user);
          setUser(response.data.user);
        } else {
          console.error("API error:", response.data);
          setError(response.data?.message || 'Failed to fetch user details');
        }
      } catch (err) {
        console.error("API call exception:", err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <div className="profile-card">
        
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{user.name}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone:</span>
            <span className="detail-value">{user.phoneNumber}</span>
          </div>
        </div>
      </div>
      
      <div className="profile-actions">
        <Link to="/edit-profile" className="edit-profile-btn">Edit Profile</Link>
        <Link to="/my-listings" className="my-listings-btn">My Listings</Link>
      </div>
    </div>
  );
};

export default Profile;