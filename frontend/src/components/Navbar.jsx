import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    JobPortal
                </Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    {user ? (
                        <>
                            {user.role === 'candidate' && <Link to="/dashboard/candidate">Dashboard</Link>}
                            {user.role === 'employer' && <Link to="/dashboard/employer">Dashboard</Link>}
                            {user.role === 'admin' && <Link to="/dashboard/admin">Admin</Link>}
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '5px 10px' }}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '5px 15px', color: 'white' }}>Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
