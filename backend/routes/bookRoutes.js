const express = require("express");
const Book = require("../models/Book"); // Ensure this matches the updated model

const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch from "Books" collection
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
