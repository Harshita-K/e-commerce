import React from 'react'
import { NavLink } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div>
          <NavLink to="/" className="navbar-logo" activeClassName="active">BuySell</NavLink>
        </div>
        
        <div className="navbar-links">
          <NavLink to="/shop" className="navbar-link" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" className="navbar-link-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            Shop
          </NavLink>
          
          <NavLink to="/cart" className="navbar-link" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" className="navbar-link-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
            </svg>
            Cart
          </NavLink>
          
          <NavLink to="/Dashboard" className="navbar-link" activeClassName="active">
            <svg xmlns="http://www.w3.org/2000/svg" className="navbar-link-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Dashboard
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar