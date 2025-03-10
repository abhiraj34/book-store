const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Link cart to user email
  items: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      title: String,
      author: String,
      price: String,
      image: String,
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
