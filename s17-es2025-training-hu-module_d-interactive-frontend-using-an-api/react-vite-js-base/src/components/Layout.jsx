import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../contexts/AppContext';

const Layout = ({ children }) => {
    const location = useLocation();
    const { userData, setUserData, getUser, logout } = useContext(AppContext);

    useEffect(() => {
        getUser();
    }, []);

    return <>
        <header className='main-header'>
            <nav>
                <Link to="/"><div className="logo">SKILLSHARE ACADEMY</div></Link>
                <div className="center-links">
                    <Link to="/" className={location.pathname === "/" ? 'selected' : ''}>Dashboard</Link>
                    <Link to="/courses" className={location.pathname === "/courses" ? 'selected' : ''}>Courses</Link>
                    <Link to="/mentors" className={location.pathname === "/mentors" ? 'selected' : ''}>Mentors</Link>
                </div>
                <div className="right-links">
                    <div className="credit-count">
                        { userData ? `${userData.user.creditBalance} CREDITS` : "Loading" }
                    </div>
                    <div className="user">
                        { userData ? `Welcome, ${userData.user.name}` : "Loading" }
                    </div>
                    <button onClick={logout} className="logout-button">
                        LOGOUT
                    </button>
                </div>
            </nav>
        </header>
        <main>
            {userData && children}
            <div className={`loading-screen${userData ? '' : ' loading'}`}>
                <h1>SKILLSHARE ACADEMY</h1>
            </div>
        </main>
    </>
};

export default Layout;
