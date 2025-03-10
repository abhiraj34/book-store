import React, { useState, useEffect } from "react";
import "./dash.css";

const Dash = ({ updateCartCount }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/books");
        if (!response.ok) throw new Error("Failed to fetch books");

        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingBookIndex = cart.findIndex((item) => item._id === book._id);

    if (existingBookIndex !== -1) {
      cart[existingBookIndex].quantity += 1;
    } else {
      cart.push({ ...book, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    if (updateCartCount) {
      updateCartCount(cart.length);
    }
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
                <p className="price">₹{book.price}</p> {/* Added ₹ symbol */}
                <button onClick={() => handleAddToCart(book)}>Add to Cart</button>
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
