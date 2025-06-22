import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './navbar.css'

const Navbar = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div>
            <NavLink to="/" className={({ isActive }) => isActive ? "navbar-logo active" : "navbar-logo"}>
              BuySell
            </NavLink>
          </div>

          <div className="navbar-links">
            <NavLink to="/shop" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Shop
            </NavLink>

            <NavLink to="/sell" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Sell
            </NavLink>

            <NavLink to="/cart" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Cart
            </NavLink>

            <NavLink to="/myproduct" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              myProducts
            </NavLink>

            <NavLink to="/myorders" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              myOrders
            </NavLink>

            <NavLink to="/deliveries" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              myDeliveries
            </NavLink>

            <NavLink to="/" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Profile
            </NavLink>

            <button className="navbar-link logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ✅ This renders the page component (like <Profile />) */}
      <main className="main-content">
        {children}
      </main>
    </>
  );
};

export default Navbar;