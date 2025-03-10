const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: String,
  image: String
}, { collection: "Books" }); // Explicitly set collection name

module.exports = mongoose.model("Book", bookSchema);
