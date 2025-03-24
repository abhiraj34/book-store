import React, { useState, useEffect } from "react";
import "./dash.css";

const Dash = ({ updateCartCount }) => {
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]); // Track books in the cart

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        setBooks(data);

        // Load cart from localStorage
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(savedCart);
        console.log("Cart Loaded from LocalStorage:", savedCart); // Debugging
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    let updatedCart = [...cart];
    const existingBookIndex = updatedCart.findIndex((item) => item._id === book._id);

    if (existingBookIndex !== -1) {
      updatedCart[existingBookIndex].quantity += 1;
    } else {
      updatedCart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    if (updateCartCount) {
      updateCartCount(updatedCart.reduce((sum, item) => sum + item.quantity, 0));
    }

    console.log("Cart Updated:", updatedCart); // Debugging
  };

  const getBookQuantity = (bookId) => {
    const item = cart.find((item) => item._id === bookId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="dash-container">
      <h2 className="section-title">Featured Books</h2>
      <div className="book-section">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="book-card">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p className="price">₹{book.price}</p>

                {getBookQuantity(book._id) > 0 ? (
                  <div className="cart-actions">
                    <button className="added-btn">Added ({getBookQuantity(book._id)})</button>
                    <button className="plus-btn" onClick={() => handleAddToCart(book)}>+</button>
                  </div>
                ) : (
                  <button onClick={() => handleAddToCart(book)}>Add to Cart</button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-books">No books available.</p>
        )}
      </div>
    </div>
  );
};

export default Dash;
