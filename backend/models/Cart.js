const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
            title: { type: String, required: true },
            price: { type: String, required: true },
            quantity: { type: Number, required: true }
        }
    ]
});

module.exports = mongoose.model("Cart", CartSchema);
