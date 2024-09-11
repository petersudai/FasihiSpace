const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import CORS middleware

dotenv.config();
connectDB();

const app = express();

// Define CORS options for specific origins
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Use CORS with the defined options
app.use(cors(corsOptions));

// Preflight request handler for all routes
app.options('*', cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Test route for debugging CORS
app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
