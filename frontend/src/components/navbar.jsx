import React from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.css'

const Navbar = ({ children }) => {
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

            <NavLink to="/cart" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Cart
            </NavLink>

            <NavLink to="/Dashboard" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
              Dashboard
            </NavLink>
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