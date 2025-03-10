const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = "mongodb://127.0.0.1:27017/bookstore"; // Use 127.0.0.1 instead of localhost

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
exit
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB Connection Failed:", error.message);
    process.exit(1);
  }a
};

module.exports = connectDB;
