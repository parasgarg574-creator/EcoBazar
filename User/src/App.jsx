import { useState } from 'react'
import {Route,Routes} from 'react-router-dom'
import Category from './Pages/Category'
import Navbar from './Component/Navbar'
import Home from './Pages/Home'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<Category />} />
    </Routes>
  )
}

export default App
