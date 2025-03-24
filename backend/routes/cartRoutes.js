const express = require("express");
const Cart = require("../models/Cart"); // Import the Cart model
const verifyToken = require("../middleware/authMiddleware"); // Ensure user authentication
const router = express.Router();

// Add item to cart
router.post("/add", verifyToken, async (req, res) => {
    try {
        const { bookId, title, price, quantity } = req.body;
        const userId = req.user.userId;   

        if (!bookId || !title || !price || !quantity) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if item already exists
        const existingItem = cart.items.find(item => item.bookId.toString() === bookId.toString());
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ bookId, title, price, quantity });
        }

        await cart.save();
        res.json({ success: true, message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Error adding item to cart", error: error.message });
    }
});

// Get cart items
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id; // Ensure correct userId

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const cart = await Cart.findOne({ userId }).populate("items.bookId");

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        res.json({ success: true, cart });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Error fetching cart", error: error.message });
    }
});

router.delete("/remove/:bookId", verifyToken, async (req, res) => {
  try {
      const { bookId } = req.params; 
      const userId = req.user.userId || req.user.id;

      const cart = await Cart.findOneAndUpdate(
          { userId },
          { $pull: { items: { bookId: bookId } } }, // Remove specific bookId from items array
          { new: true } // Return updated cart
      );

      if (!cart) {
          return res.status(404).json({ success: false, message: "Cart not found" });
      }

      res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
      console.error("Error removing item from cart:", error);
      res.status(500).json({ success: false, message: "Error removing item", error: error.message });
  }
});

// ✅ Clear the entire cart (DELETE /cart/clear)
router.delete("/clear", verifyToken, async (req, res) => {
  try {
      const userId = req.user.userId || req.user.id;

      const deletedCart = await Cart.findOneAndDelete({ userId });

      if (!deletedCart) {
          return res.status(404).json({ success: false, message: "Cart already empty or not found" });
      }

      res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
  }
});

module.exports = router;