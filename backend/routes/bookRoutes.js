const express = require("express");
const jwt = require("jsonwebtoken");
const Book = require("../models/Book");
const User = require("../models/user");

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  try {
    const { title, author, price, image } = req.body;
    if (!title || !author || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBook = new Book({ title, author, price, image });
    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update book details
router.put("/:id", async (req, res) => {
  try {
    const { title, author, price, image } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, price, image },
      { new: true }
    );

    if (!updatedBook) return res.status(404).json({ message: "Book not found" });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });

    res.json({ message: "Book deleted successfully", deletedBook });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Highest Buyer (User who bought the most books)
router.get("/highest-buyer", async (req, res) => {
  try {
    const highestBuyer = await User.findOne().sort("-purchaseCount");
    if (!highestBuyer) return res.status(404).json({ message: "No buyers found" });

    res.json(highestBuyer);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
