import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { ShopContext } from '../../Context/ShopContext';

const Navbar = () => {
    const [menu, setMenu] = useState('shop');
    const [showLogoutMessage, setShowLogoutMessage] = useState(false); // State to control the display of the logout message
    const { getTotalCartItems } = useContext(ShopContext);
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        setShowLogoutMessage(true); // Show the logout message
        setTimeout(() => {
            setShowLogoutMessage(false); // Hide the message after 3 seconds
        }, 3000);
        navigate('/'); // Redirect to homepage after logout
    };

    return (
        <div className='navbar'>
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>GizmoGrid</p>
            </div>
            <ul className="nav-menu">
                <li onClick={() => { setMenu("shop") }}>
                    <Link style={{ textDecoration: 'none' }} to='/'>Gadgets</Link>
                    {menu === "shop" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("men") }}>
                    <Link style={{ textDecoration: 'none' }} to='/men'>Laptops</Link>
                    {menu === "men" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("women") }}>
                    <Link style={{ textDecoration: 'none' }} to='/women'>Computers</Link>
                    {menu === "women" ? <hr /> : <></>}
                </li>
                <li onClick={() => { setMenu("kids") }}>
                    <Link style={{ textDecoration: 'none' }} to='/kids'>Phones</Link>
                    {menu === "kids" ? <hr /> : <></>}
                </li>
            </ul>

            <div className="nav-login-cart">
                {/* Conditionally render Login or Logout button */}
                {localStorage.getItem('token') ? (
                    <button onClick={handleLogout}>Logout</button> // Show logout if logged in
                ) : (
                    <Link to='/login'> <button>Login</button> </Link> // Show login if not logged in
                )}

                <Link to='/cart'>
                    <img src={cart_icon} alt="" />
                </Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>

            {/* Show logout message temporarily */}
            {showLogoutMessage && (
                <div className="logout-message">
                    You have logged out successfully!
                </div>
            )}
        </div>
    );
};

export default Navbar;
