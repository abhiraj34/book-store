import React, { useState, useEffect } from "react";
import "./cart.css";

const Cart = ({ updateCartCount }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(cart);
      console.log("Fetched Cart from LocalStorage:", cart); // Debugging
    };

    fetchCart();
  }, []);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleBuyNow = () => {
    if (cartItems.length === 0) return alert("Your cart is empty!");

    // Move cart items to orders
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const newOrders = [...existingOrders, ...cartItems];
    localStorage.setItem("orders", JSON.stringify(newOrders));

    // Empty the cart
    localStorage.removeItem("cart");
    setCartItems([]);
    updateCartCount(0); // Reset cart count
    alert("Order placed successfully!");
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item._id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price * item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-cart">Your cart is empty.</p>
      )}
      <h3 className="total-price">Total: ₹{calculateTotal()}</h3>
      
      {/* Buy Now Button */}
      {cartItems.length > 0 && (
        <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
      )}
    </div>
  );
};

export default Cart;
