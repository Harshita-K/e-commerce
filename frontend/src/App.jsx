import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login.jsx'
import Signin from './pages/signin.jsx'
import Navbar from './components/navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login/>} />
        <Route path='/signin' element={<Signin/>} />
        
        {/* Protected routes */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Navbar>
              <Dashboard />
            </Navbar>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App
