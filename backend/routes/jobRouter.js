import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postJob,
  getAllJobs,
  getASingleJob,
  getMyJobs,
  deleteJob,
} from "../controllers/jobController.js";

const router = express.Router();

// Public Routes
router.get("/", getAllJobs);
router.get("/my-jobs", isAuthenticated, isAuthorized("Employer"), getMyJobs); // Move this above `/:id`
router.get("/:id", getASingleJob);  // Now it won't conflict

// Protected Routes (Employer Only)
router.use(isAuthenticated, isAuthorized("Employer"));

router.post("/", postJob);
router.delete("/:id", deleteJob);

export default router;
