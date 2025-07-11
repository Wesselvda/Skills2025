import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"
import Layout from "./Layouts/Layout"
import Admin from "./Pages/Admin"
import Login from "./Pages/Login"
import Company from "./Pages/Company"
import Product from "./Pages/Product"

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/company/:company_id" element={<Company />} />
            <Route path="/admin/company/:company_id/createproduct" element={<Product />} />
            <Route path="/admin/product/:gtin" element={<Product />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
