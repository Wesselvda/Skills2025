import { Link, Outlet } from "react-router-dom"
import AppContext from "../contexts/AppContext";
import { useContext } from "react";

const Layout = () => {
  const { user, logout } = useContext(AppContext);

  return (
    <>
        <nav className="main-nav">
            <Link to="/">Home</Link>
            {user ? (
              <>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
        </nav>
        <main>
            <Outlet />
        </main>
    </>
  )
}

export default Layout