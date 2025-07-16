const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const exampleRoutes = require('./routes/exampleRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Load env
dotenv.config();

// Connect to DB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/example', exampleRoutes);

// Handle 404
app.use(notFound);

// Error handler
app.use(errorHandler);


module.exports = app;
