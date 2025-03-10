import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { CartContext } from '../context/CartContext';
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { cart } = useContext(CartContext); // Access cart data

  // Handle logout
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
        <Link to="/" className="home-btn">Home</Link>  
        <Link to="/orders" className="orders-btn">Orders</Link>
        <Link to="/cart" className="cart-btn">Cart</Link>
      </div>

      <div className="nav-end">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
