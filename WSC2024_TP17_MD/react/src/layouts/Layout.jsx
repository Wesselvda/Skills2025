import { Outlet, NavLink } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Layout = () => {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Navbar />
    </>
  )
}

export default Layout
