import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  try {
    // Parse JWT token to check expiration
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      // Invalid JWT format
      localStorage.removeItem('token');
      return false;
    }
    
    // Decode the payload (second part of JWT)
    const payload = JSON.parse(atob(tokenParts[1]));
    
    // Check if token has expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token is expired, remove it
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format, remove it
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;