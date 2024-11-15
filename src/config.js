const mongoose = require("mongoose");
require('dotenv').config(); // To use the MONGO_URI from the .env file

// Connect to the MongoDB database
const connect = mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Database Connected.");
    })
    .catch((error) => {
        console.error("Failed to connect to the Database:", error);
    });

// Create schema for the user
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

// Create and export the user model
module.exports = mongoose.model("User", userSchema);
