const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // Import database connection

const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cartRoutes"); // Ensure correct import
const bookRoutes = require("./routes/bookRoutes"); // Import book routes

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend requests
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json()); // Parse JSON requests

//Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes); // Ensure this is correctly defined
app.use("/api/books", bookRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
