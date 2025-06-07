// backend/middleware/errorMiddleware.js

// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set status to 404
  next(error); // Pass the error to the next middleware (errorHandler)
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
  // Determine the status code: if it's still 200 (OK), set to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode); // Set the response status code

  // Send a JSON response with the error message and stack trace (in development)
  res.json({
    message: err.message, // The error message
    // Include stack trace only in development environment for debugging
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// Export the middleware functions
export { notFound, errorHandler };
