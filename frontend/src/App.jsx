
import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Profile from './pages/profile.jsx'
import Login from './pages/login.jsx'
import Navbar from './components/navbar.jsx'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route  path='/login' element={<Login/>} />
      </Routes>
    </div>
  )
}

export default App
