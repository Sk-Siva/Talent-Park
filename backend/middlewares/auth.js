import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";

/**
 * Middleware to check if a user is authenticated.
 */
import mongoose from "mongoose"; // Import Mongoose for validation

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Check if `decoded.id` is a valid Mongoose ObjectId
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return next(new ErrorHandler("Invalid user ID.", 400));
    }

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found.", 404));
    }
    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token.", 403));
  }
});


/**
 * Middleware to check if a user has the required role(s).
 * @param  {...string} roles - Allowed roles
 */
export const isAuthorized = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new ErrorHandler(
        `Access denied. Role '${req.user.role}' is not authorized.`,
        403
      )
    );
  }
  next();
};