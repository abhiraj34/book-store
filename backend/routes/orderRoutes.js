const express = require("express");

const router = express.Router();

//  Place order (Move cart items to orders)
router.post("/place", (req, res) => {
    const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];

    if (cart.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    let orders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];
    
    // Add current cart as a new order
    const newOrder = { orderId: Date.now(), items: cart, date: new Date().toISOString() };
    orders.push(newOrder);

    // Save updated orders in cookies
    res.cookie("orders", JSON.stringify(orders), { httpOnly: true, maxAge: 365 * 24 * 60 * 60 * 1000 });

    // Clear cart after placing order
    res.clearCookie("cart");

    res.json({ success: true, message: "Order placed successfully", order: newOrder });
});

//  Get all orders for the user
router.get("/", (req, res) => {
    const orders = req.cookies.orders ? JSON.parse(req.cookies.orders) : [];
    res.json({ orders });
});

//  Clear all orders (for testing purposes)
router.post("/clear", (req, res) => {
    res.clearCookie("orders");
    res.json({ success: true, message: "All orders cleared" });
});

module.exports = router;
