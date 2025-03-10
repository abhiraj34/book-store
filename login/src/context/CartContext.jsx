import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const currentToken = localStorage.getItem("token"); //Fetch token dynamically
    if (currentToken) {
      fetchCart(currentToken);
    }
  }, []); // Runs only once on mount

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("No token found. User needs to log in.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/cart", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (response.status === 401) {
        console.error("Unauthorized: Invalid token. Logging out user...");
        localStorage.removeItem("token"); // Clear invalid token
        return;
      }
  
      const data = await response.json();
  
      if (response.ok) {
        setCart(data.cart);
      } else {
        console.error("Error fetching cart:", data.error);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const addToCart = async (book) => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Please log in first!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/cart/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ book }),
      });
  
      console.log("Server Response:", response); // Debugging
  
      if (!response.ok) {
        const errorText = await response.text(); // Read error as text (for HTML errors)
        console.error("Server Error:", errorText);
        alert(`Failed to add book: ${errorText}`);
        return;
      }
  
      const data = await response.json();
      setCart(data.cart); // Update the cart
      alert("Book added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Something went wrong.");
    }
  };
  

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
