require('dotenv').config();  // Load environment variables from .env file
const mongoose = require('mongoose');

// Use MONGO_URI from the environment variables
let db = "mongodb+srv://ayushgupta23cse:huZ72AEJ3GohLeoC@cluster0.0lyg6.mongodb.net/your-database-name?retryWrites=true&w=majority";

// Connect to MongoDB Atlas
const connect = async () => {
    try {
        await mongoose.connect(db, {});
        console.log('MongoDB Atlas connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        process.exit(1); // Terminate the process if DB connection fails
    }
};

module.exports = connect;
