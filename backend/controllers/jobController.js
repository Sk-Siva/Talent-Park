import mongoose from "mongoose"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

// Utility function to check for missing fields
const validateFields = (fields) => fields.some((field) => !field);

/**
 * @desc    Create a new job listing
 * @route   POST /api/jobs
 * @access  Private (Employer Only)
 */
export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsiteTitle,
    personalWebsiteUrl,
    jobNiche,
  } = req.body;

  // Validate required fields
  if (
    validateFields([
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsibilities,
      qualifications,
      salary,
      jobNiche,
    ])
  )
    return next(new ErrorHandler("Please provide full job details.", 400));

  // Validate website fields
  if ((personalWebsiteTitle && !personalWebsiteUrl) || (!personalWebsiteTitle && personalWebsiteUrl)) {
    return next(new ErrorHandler("Provide both website URL and title, or leave both blank.", 400));
  }

  // Create job
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsibilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite: { title: personalWebsiteTitle, url: personalWebsiteUrl },
    jobNiche,
    postedBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Job posted successfully.", job });
});

/**
 * @desc    Get all jobs with optional filters
 * @route   GET /api/jobs
 * @access  Public
 */
export const getAllJobs = catchAsyncErrors(async (req, res) => {
  const { city, niche, searchKeyword } = req.query;
  const query = {
    ...(city && { location: city }),
    ...(niche && { jobNiche: niche }),
    ...(searchKeyword && {
      $or: [
        { title: new RegExp(searchKeyword, "i") },
        { companyName: new RegExp(searchKeyword, "i") },
        { introduction: new RegExp(searchKeyword, "i") },
      ],
    }),
  };

  const jobs = await Job.find(query);
  res.status(200).json({ success: true, jobs, count: jobs.length });
});

/**
 * @desc    Get jobs posted by the logged-in employer
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Employer Only)
 */

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user._id.toString() }); // Ensure string format
    res.status(200).json({ success: true, myJobs });
  } catch (error) {
    next(error); // Pass error to error handler
  }
});


/**
 * @desc    Get a single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found.", 404));

  res.status(200).json({ success: true, job });
});

/**
 * @desc    Delete a job by ID
 * @route   DELETE /api/jobs/:id
 * @access  Private (Employer Only)
 */
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Oops! Job not found.", 404));

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted." });
});
