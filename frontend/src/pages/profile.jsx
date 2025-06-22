import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Backend response:', response.data);

      if (response.data.success) {
        setUserData({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phoneNumber: response.data.user.phoneNumber || ''
        });
      } else {
        setError("Failed to find user data: " + (response.data.message || 'No details available'));
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Error loading profile data');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset success and error messages when toggling edit mode
    setSuccess('');
    setError('');
  };

  // Function to cancel editing and revert changes
  const handleCancelEdit = () => {
    fetchUserProfile(); // Refetch original data
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  // Function to save profile changes
  const handleSaveChanges = async () => {
    try {
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Call the updateUserDetails function in the backend
      const response = await axios.put('http://localhost:8080/api/users/profile', userData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Update the local state with the returned user data
        setUserData({
          name: response.data.user.name || '',
          email: response.data.user.email || '',
          phoneNumber: response.data.user.phoneNumber || ''
        });
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'An error occurred while updating profile');
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmNewPassword) {
      setError('Please fill all password fields.');
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.post('http://localhost:8080/api/users/profile/changepass', {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSuccess('Password changed successfully!');
        setShowPasswordForm(false);
        setPasswords({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while changing password');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      setError('');
      setSuccess('');
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      const response = await axios.delete('http://localhost:8080/api/users/profile/delete', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        localStorage.removeItem('token');
        alert('Account deleted successfully');
        navigate('/');
        window.location.reload();
      } else {
        setError(response.data.message || 'Failed to delete account');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting account');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading profile data...</div>;
  }

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-placeholder">
            {userData.name ? userData.name.charAt(0).toUpperCase() : '?'}
          </div>
          <h3>{userData.name || 'User'}</h3>
        </div>

        <div className="profile-details">
          {isEditing ? (
            // Editable fields
            <>
              <div className="profile-field">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={userData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-field">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={userData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-field">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber" 
                  value={userData.phoneNumber} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="profile-actions">
                <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
                <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </>
          ) : (
            // Read-only profile display
            <>
              <div className="profile-field">
                <label>Name</label>
                <p>{userData.name}</p>
              </div>
              
              <div className="profile-field">
                <label>Email</label>
                <p>{userData.email}</p>
              </div>
              
              <div className="profile-field">
                <label>Phone Number</label>
                <p>{userData.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div className="profile-actions">
                <button className="edit-button" onClick={toggleEditMode}>Edit Profile</button>
                <button className="change-password-button" onClick={() => setShowPasswordForm(!showPasswordForm)} style={{marginLeft: '1rem'}}>Change Password</button>
                <button className="delete-account-button" onClick={handleDeleteAccount} style={{marginLeft: '1rem'}}>Delete Account</button>
              </div>
            </>
          )}
        </div>

        {showPasswordForm && (
          <div className="change-password-form">
            <div className="profile-field">
              <label>Old Password</label>
              <input type="password" name="oldPassword" value={passwords.oldPassword} onChange={handlePasswordInputChange} />
            </div>
            <div className="profile-field">
              <label>New Password</label>
              <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordInputChange} />
            </div>
            <div className="profile-field">
              <label>Confirm New Password</label>
              <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={handlePasswordInputChange} />
            </div>
            <div className="profile-actions">
              <button className="save-button" onClick={handleChangePassword}>Save Password</button>
              <button className="cancel-button" onClick={() => setShowPasswordForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;