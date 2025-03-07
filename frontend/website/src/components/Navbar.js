import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Navbar.css';
import { FaHome, FaUser, FaSignInAlt, FaSignOutAlt, FaShoppingCart, FaUserCircle, FaPlusCircle } from 'react-icons/fa';
import logo from './images/logo.png';
import SearchBar from './SearchBar';

const Navbar = () => {
    const state = useSelector(state => state); // Debugging step
  console.log("Redux State:", state);

  const { products, error } = useSelector(state => state.products); // Get products from Redux
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const [isOverlayVisible, setOverlayVisible] = useState(false);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        setOverlayVisible(false);
    };

    const handleProductSelect = (productId) => {
        navigate(`/products/${productId}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target)) {
                setOverlayVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-brand">
            {error && <p className="error-message">Error: {error}</p>}
                <img src={logo} alt="Logo" />
                <p className="navbar-title">SRI GANESH AGENCIES</p>
            </div>
            <SearchBar products={products} onProductSelect={handleProductSelect} />
            <ul className="navbar-links">
                <li><Link to="/"><FaHome style={{transform : 'translateY(2px)',}}/> Home</Link></li>
                <li><Link to="/orders"><FaShoppingCart style={{transform : 'translateY(2px)',}}/> Orders</Link></li>
                {isAdmin && (
                    <li><Link to="/add-product"><FaPlusCircle style={{transform : 'translateY(2px)',}} /> Add Product</Link></li>
                )}
                {token ? (
                    <li>
                        <FaUserCircle onClick={() => setOverlayVisible(!isOverlayVisible)} style={{ cursor: 'pointer',transform : 'translateY(2px)', }} />
                        {isOverlayVisible && (
                            <div className="overlay" ref={overlayRef}>
                                <ul>
                                    <li><Link to="/profile"><FaUser /> Profile</Link></li>
                                    <li><a href="/" onClick={handleLogout}><FaSignOutAlt /> Logout</a></li>
                                </ul>
                            </div>
                        )}
                    </li>
                ) : (
                    <li><Link to="/auth"><FaSignInAlt /> Login</Link></li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
