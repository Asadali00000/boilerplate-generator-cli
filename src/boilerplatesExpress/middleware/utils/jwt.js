const jwt = require('jsonwebtoken');

/**
 * Verify JWT token using secret key
 */
async function verifyJwt(token) {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');

    // Get JWT secret from environment variables
		const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    // Verify token with secret key
    const decoded = jwt.verify(cleanToken, JWT_SECRET);

    return decoded;
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else if (error.name === 'NotBeforeError') {
      throw new Error('Token not active');
    } else {
      throw new Error('Token verification failed: ' + error.message);
    }
  }
}

/**
 * Generate JWT token (helper function)
 */
function generateJwt(payload, expiresIn = '24h') {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

module.exports = { verifyJwt, generateJwt };
