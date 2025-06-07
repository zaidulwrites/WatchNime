// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js'; // Import your User model

// Middleware to protect routes: verifies JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token from header

      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

      // Attach user from token payload to request using your User model
      // Note: User ID is stored in decoded.user.id
      req.user = await User.findById(decoded.user.id);

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401); // Unauthorized
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); // Unauthorized
    throw new Error('Not authorized, no token');
  }
});

// Middleware to authorize based on roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user comes from the 'protect' middleware
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(`User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
    }
    next();
  };
};

export { protect, authorize };
