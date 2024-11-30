const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Load environment variables
let dbconnect = require('./connections/connect.js');
dbconnect(); // Initialize MongoDB connection

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (adjust as per requirement)
app.use(express.json()); // Parse incoming JSON requests
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/' })); // Middleware for handling file uploads
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Constants
const PORT = process.env.PORT || 4000; // Use environment variable for port or default to 4000

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Define Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  photos: { type: [String], required: true },
});
const Book = mongoose.model('Book', bookSchema);

// Serve static HTML files
app.use(express.static('D:/Shelf-whisper-'));

// Route to serve the HTML file (Set password page)
app.get('/', (req, res) => {
  res.sendFile(path.join('D:/Shelf-whisper-', 'setpassword.html'));
});

// User Login Route (for login in enterpassword.html)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and Password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Compare password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Successfully logged in, send user details (without password)
    res.status(200).json({ message: 'Login successful', user: { email: user.email, fullname: user.fullname } });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route for handling book submissions (Sell Book)
app.post('/sell-book', async (req, res) => {
  const { title, author, price, description } = req.body;
  const photos = req.files ? req.files.photos : null; // Handle photo uploads

  if (!title || !author || !price || !description || !photos) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Ensure that the 'uploads' folder exists, or create it
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the folder if it doesn't exist
    console.log('Uploads directory created!');
  }

  try {
    // Save photos in the server's public directory
    const photoPaths = [];
    if (Array.isArray(photos)) {
      // If multiple photos are uploaded
      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        const photoPath = `uploads/${Date.now()}_${photo.name}`;
        await photo.mv(path.join(__dirname, 'public', photoPath));
        photoPaths.push(photoPath);
      }
    } else {
      // If a single photo is uploaded
      const photo = photos;
      const photoPath = `uploads/${Date.now()}_${photo.name}`;
      await photo.mv(path.join(__dirname, 'public', photoPath));
      photoPaths.push(photoPath);
    }

    // Create new book document in MongoDB
    const newBook = new Book({
      title,
      author,
      price,
      description,
      photos: photoPaths,
    });

    await newBook.save();
    res.status(200).json({ message: 'Book uploaded successfully' });
  } catch (error) {
    console.error('Error uploading book:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get all books
app.get('/get-books', async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.status(200).json({ books });
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Default fallback route (for 404 errors)
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
