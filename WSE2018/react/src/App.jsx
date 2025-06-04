import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layouts/Layout'
import Home from './Pages/Home'
import Cart from './Pages/Cart'
import Admin from './Pages/Admin'
import AppContext from './Contexts/AppContext.jsx'
import { useState } from 'react'

function App() {
  const [navItems, setNavItems] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <AppContext.Provider value={[
      navItems, setNavItems,
      cart, setCart
    ]}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/admin' element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
