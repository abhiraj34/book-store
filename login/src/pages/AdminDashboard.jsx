import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./dash.css"; // Using the same styling as Dash.jsx

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null); // Track the book being edited
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
  });

  const token = localStorage.getItem("token"); // Fetch token from local storage
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Entering into Admin Page;");

    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleUpdateBook = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/books/${id}`,
        editBook,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book._id === id ? { ...book, ...editBook } : book
        )
      );

      setEditBook(null);
    } catch (error) {
      console.error("Error updating book:", error.response?.data || error.message);
    }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/books", newBook, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks([...books, response.data]);
      setNewBook({ title: "", author: "", price: "", image: "" });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  const handleDeleteBook = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div className="dash-container">
      <h2 className="section-title">Admin Dashboard - Manage Books</h2>

      {/* Add New Book */}
      <div className="add-book">
        <h3>Add New Book</h3>
        <input
          type="text"
          placeholder="Title"
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newBook.price}
          onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newBook.image}
          onChange={(e) => setNewBook({ ...newBook, image: e.target.value })}
        />
        <button onClick={handleAddBook}>Add Book</button>
      </div>

      {/* Edit/Delete Books */}
      <div className="book-section">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book._id} className="book-card">
              <img src={book.image} alt={book.title} className="book-image" />
              <div className="book-info">
                {editBook && editBook._id === book._id ? (
                  <>
                    <input
                      type="text"
                      value={editBook.title}
                      onChange={(e) =>
                        setEditBook({ ...editBook, title: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editBook.author}
                      onChange={(e) =>
                        setEditBook({ ...editBook, author: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editBook.price}
                      onChange={(e) =>
                        setEditBook({ ...editBook, price: e.target.value })
                      }
                    />
                    <button onClick={() => handleUpdateBook(book._id)}>Save</button>
                  </>
                ) : (
                  <>
                    <h3>{book.title}</h3>
                    <p>Author: {book.author}</p>
                    <p className="price">₹{book.price}</p>
                    <button onClick={() => setEditBook(book)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteBook(book._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-books">No books available.</p>
        )}
      </div>

      {/* Logout */}
      <button
        className="logout-button"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/admin-login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;  