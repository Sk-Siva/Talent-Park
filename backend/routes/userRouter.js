import express from "express";
import { 
  getUser, 
  login, 
  logout, 
  register, 
  updatePassword, 
  updateProfile 
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for user login
router.post("/login", login);

// Route for user logout (requires authentication)
router.get("/logout", isAuthenticated, logout);

// Route to fetch logged-in user's details (requires authentication)
router.get("/getuser", isAuthenticated, getUser);

// Route to update user profile details (requires authentication)
router.put("/update/profile", isAuthenticated, updateProfile);

// Route to update user password (requires authentication)
router.put("/update/password", isAuthenticated, updatePassword);

export default router;
