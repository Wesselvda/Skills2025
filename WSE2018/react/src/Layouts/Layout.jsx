import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import AppContext from '../Contexts/AppContext'
import { getCart, getNavItems } from '../Handlers/APIHandler';

const Layout = () => {
    const [navItems, setNavItems, cart, setCart] = useContext(AppContext);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        getNavItems(setNavItems);
        setCart(getCart());
    }, [])

    return (
        <>
            <nav className={`main-nav${menuOpen ? ' menu-open' : ''}`}>
                <div className='nav-links'>
                    {navItems.map(item => {
                        return <Link key={item.id} to={item.link}>{item.name}{item.name === "Cart" && cart.length > 0 && ` (${cart.length})`}</Link>
                    })}
                </div>
                <button onClick={() => {setMenuOpen(!menuOpen)}} className='closebutton'>{menuOpen ? 'Close' : 'Menu'}</button>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout