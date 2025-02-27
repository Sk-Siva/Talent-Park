/**
 * Custom Error Handler Class
 * Extends JavaScript's built-in Error class to handle application-specific errors.
 */
class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Express Error Handling Middleware
 * Handles various types of errors and sends a structured JSON response.
 */
export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle invalid Mongoose ObjectId errors
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
    console.log(err)
  }

  // Handle duplicate key errors (MongoDB unique field violation)
  if (err.code === 11000) {
    err = new ErrorHandler(`Duplicate ${Object.keys(err.keyValue)} entered`, 400);
  }

  // Handle invalid JWT token errors
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid JSON Web Token, please try again.", 400);
  }

  // Handle expired JWT token errors
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired, please log in again.", 400);
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;