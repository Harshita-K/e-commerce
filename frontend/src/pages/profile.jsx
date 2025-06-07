import React, { useState } from 'react';

const Profile = () => {
  // State to hold user details
  const [userDetails, setUserDetails] = useState({
    name: 'Jiya',
    email: 'jiya@gmail.com',
    phone: '1234567890',
  });

  // State to toggle edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Handle save
  const handleSave = () => {
    setIsEditing(false);
    // You can add logic here to save the updated details to a database or API
    console.log('Updated user details:', userDetails);
  };

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      <div className="profile-details">
        <label>
          Name:
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={userDetails.name}
              onChange={handleChange}
            />
          ) : (
            <span>{userDetails.name}</span>
          )}
        </label>
        <label>
          Email:
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleChange}
            />
          ) : (
            <span>{userDetails.email}</span>
          )}
        </label>
        <label>
          Phone:
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={userDetails.phone}
              onChange={handleChange}
            />
          ) : (
            <span>{userDetails.phone}</span>
          )}
        </label>
      </div>
      <div className="profile-actions">
        {isEditing ? (
          <button onClick={handleSave}>Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        )}
      </div>
    </div>
  );
};

export default Profile;