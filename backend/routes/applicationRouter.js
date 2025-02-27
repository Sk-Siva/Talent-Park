import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  deleteApplication,
  employerGetAllApplications,
  jobSeekerGetAllApplications,
  postApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// Job Seeker - Apply for a Job
router.post("/:id/apply", isAuthenticated, isAuthorized("Job Seeker"), postApplication);

// Employer - Get All Applications
router.get("/employer", isAuthenticated, isAuthorized("Employer"), employerGetAllApplications);

// Job Seeker - Get Own Applications
router.get("/jobseeker", isAuthenticated, isAuthorized("Job Seeker"), jobSeekerGetAllApplications);

// Delete an Application (Accessible by both Employer & Job Seeker)
router.delete("/:id", isAuthenticated, deleteApplication);

export default router;