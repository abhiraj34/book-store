import React, { useEffect, useState } from "react";
import "./cart.css";

const Cart = ({ updateCartCount }) => {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const mergedCart = mergeCartItems(savedCart);
    setCart(mergedCart);
    calculateTotal(mergedCart);
  }, []);

  // Merges duplicate items in the cart and sums up their quantities
  const mergeCartItems = (cartItems) => {
    return cartItems.reduce((acc, book) => {
      const existingItem = acc.find((item) => item._id === book._id);
      if (existingItem) {
        existingItem.quantity += book.quantity;
      } else {
        acc.push({ ...book });
      }
      return acc;
    }, []);
  };

  // Function to calculate total price
  const calculateTotal = (cartItems) => {
    const total = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    setTotalPrice(total);
  };

  // Function to remove a book from the cart (decreases quantity or removes item)
  const handleRemoveFromCart = (bookId) => {
    const updatedCart = cart.map((item) =>
      item._id === bookId ? { ...item, quantity: item.quantity - 1 } : item
    ).filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);

    if (updateCartCount) {
      updateCartCount(updatedCart.length);
    }
  };

  // Function to handle "Buy Now"
  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Get existing orders or create a new one
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const updatedOrders = [...existingOrders, ...cart];

    // Save updated orders and clear the cart
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    localStorage.removeItem("cart");

    // Update state
    setCart([]);
    setTotalPrice(0);
    if (updateCartCount) {
      updateCartCount(0);
    }

    alert("Order placed successfully!");
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <>
          {cart.map((book) => (
            <div key={book._id} className="cart-item">
              <h4>{book.title}</h4>
              <p>Author: {book.author}</p>
              <p className="price">₹{book.price} x {book.quantity} = ₹{book.price * book.quantity}</p>
              <button onClick={() => handleRemoveFromCart(book._id)}>Remove</button>
            </div>
          ))}
          <h3 className="total-price">Total Price: ₹{totalPrice}</h3>
          <button className="buy-button" onClick={handleBuyNow}>Buy Now</button>
        </>
      )}
    </div>
  );
};

export default Cart;
