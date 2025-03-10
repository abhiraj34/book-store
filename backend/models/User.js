const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

// Fix: Check if model already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;

