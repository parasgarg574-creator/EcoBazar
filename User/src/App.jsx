import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Category from './Pages/Category'
import Products from './Pages/Products'
import ProductDetail from './Pages/ProductDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<Category />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
    </Routes>
  )
}

export default App
