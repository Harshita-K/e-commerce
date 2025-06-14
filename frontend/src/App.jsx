import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import Signin from './pages/signin.jsx'
import Navbar from './components/navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Shop from './pages/shop.jsx'
import Profile from './pages/profile.jsx'
import SellItem from './pages/SellItem.jsx'
import MyProduct from './pages/myrpoduct.jsx'
import Cart from './pages/cart.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login/>} />
        <Route path='/signin' element={<Signin/>} />
        
        {/* Protected routes */}
        <Route path='/profile' element={
          <ProtectedRoute>
            <Navbar>
              <Profile />
            </Navbar>
          </ProtectedRoute>
        } />
        <Route path='/sell' element={
          <ProtectedRoute>
            <Navbar>
              <SellItem />
            </Navbar>
          </ProtectedRoute>
        } />
        <Route path='/myproduct' element={
          <ProtectedRoute>
            <Navbar>
              <MyProduct />
            </Navbar>
          </ProtectedRoute>
        } />
        <Route path='/shop' element={
          <ProtectedRoute>
            <Navbar>
              <Shop />
            </Navbar>
          </ProtectedRoute>
        } />
        <Route path='/cart' element={
          <ProtectedRoute>
            <Navbar>
              <Cart />
            </Navbar>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
