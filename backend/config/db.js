// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     const mongoURI = "mongodb://127.0.0.1:27017/bookstore"; // Use 127.0.0.1 instead of localhost

//     await mongoose.connect(mongoURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
// exit
//     console.log(" MongoDB Connected Successfully");
//   } catch (error) {
//     console.error(" MongoDB Connection Failed:", error.message);
//     process.exit(1);
//   }a
// };

// module.exports = connectDB;

const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process on failure
    }
};

module.exports = connectDB;


