const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth"); 
const cartRoutes = require("./routes/cartRoutes"); 
const bookRoutes = require("./routes/bookRoutes"); 
const orderRoutes = require("./routes/orderRoutes"); 

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);  // Now using MongoDB
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
