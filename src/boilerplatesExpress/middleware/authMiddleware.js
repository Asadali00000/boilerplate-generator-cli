/* boilerplate code how to use in express backend  this code is not for this file add this in server.js or if you already setup ignore this setup*/
/*
const express = require('express');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

// Apply to all /api routes
app.use('/api', authMiddleware);

// Your routes
app.get('/api/users', (req, res) => {
  // req.user is available here
  res.json({ currentUser: req.user });
});
*/



const { verifyJwt } = require('./utils/verifyToken');

// Public paths that don't need authentication
const publicPaths = ['/signin', '/admin/create', '/verifyEmail', '/razorpay/webhook'];

/**
 * JWT Authentication Middleware for Express
 */
const authMiddleware = async (req, res, next) => {

  // Set CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const pathName = req.path;

  // Check if path is public
  if (publicPaths.includes(pathName)) {
    return next();
  }

  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required'
    });
  }

  try {
    const decoded = await verifyJwt(token);

    // Add user info to request object
    req.user = decoded;


    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = authMiddleware;
