const Cart = require("../models/Cart");

// Add item to cart
exports.addItemToCart = async (req, res) => {
    const { bookId, title, price, quantity } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.bookId.toString() === bookId.toString());
        if (existingItem) {
            existingItem.quantity += Number(quantity);
        } else {
            cart.items.push({ bookId, title, price, quantity: Number(quantity) });
        }

        await cart.save();
        res.json({ success: true, message: "Item added to cart", cart });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ success: false, message: "Error adding item to cart", error: error.message });
    }
};

// Get cart items
exports.getCartItems = async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId }).populate("items.bookId");
        res.json({ success: true, cart: cart || { userId, items: [] } });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Error fetching cart", error: error.message });
    }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
    const { bookId } = req.body;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.bookId.toString() !== bookId.toString());
        await cart.save();

        res.json({ success: true, message: "Item removed from cart", cart });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ success: false, message: "Error removing item from cart", error: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    const userId = req.user.id;

    try {
        await Cart.findOneAndDelete({ userId });
        res.json({ success: true, message: "Cart cleared successfully" });
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
    }
};
