const express = require("express");
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

//Fetch Cart (Already Correct)
router.get("/", authMiddleware, async (req, res) => {
  const email = req.user.email;

  try {
    const userCart = await Cart.findOne({ email });

    if (!userCart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json({ cart: userCart.items });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Add to Cart 
router.post("/add-to-cart", authMiddleware, async (req, res) => {
  try {
    const email = req.user.email; // Get email from authMiddleware
    const { book } = req.body;

    if (!book) {
      return res.status(400).json({ error: "Book details are required." });
    }

    let userCart = await Cart.findOne({ email });

    if (!userCart) {
      userCart = new Cart({ email, items: [] });
    }

    userCart.items.push(book);
    await userCart.save();

    res.status(200).json({ message: "Book added to cart successfully.", cart: userCart.items });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
