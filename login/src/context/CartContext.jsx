// CartContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ userId: "", items: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setCart({ userId: res.data.cart.userId, items: res.data.cart.items });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (book) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/add",
        { bookId: book._id, title: book.title, price: book.price, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCart({ userId: res.data.cart.userId, items: res.data.cart.items });
        alert("Book added to cart!");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/remove",
        { bookId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCart({ userId: res.data.cart.userId, items: res.data.cart.items });
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const clearCart = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/cart/clear",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCart({ userId: "", items: [] });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };
