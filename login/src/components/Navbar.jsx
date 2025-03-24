import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import { CartContext } from '../context/CartContext';
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);

  // Check if the current path starts with "/admin"
  const isAdminPage = location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <h1 className="logo-text">BookStore</h1>
      </div>

      <div className="nav-center">
        {!isAdminPage && ( // Hide buttons on admin pages
          <>
            <Link to="/" className="home-btn">Home</Link>
            <Link to="/orders" className="orders-btn">Orders</Link>
            <Link to="/cart" className="cart-btn">Cart ({cart.length})</Link>
          </>
        )}
      </div>

      <div className="nav-end">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
