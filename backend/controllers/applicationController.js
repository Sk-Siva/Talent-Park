import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";

/**
 * @desc Submit a job application
 * @route POST /api/applications/:id
 * @access Job Seeker
 */
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;

  // Validate required fields
  if (![name, email, phone, address, coverLetter].every(Boolean)) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // Check if job exists
  const job = await Job.findById(id);
  if (!job) return next(new ErrorHandler("Job not found.", 404));

  // Check if user has already applied
  const existingApplication = await Application.exists({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });

  if (existingApplication) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }

  let resume = req.user.resume || {};

  // Handle resume upload
  if (req.files?.resume) {
    try {
      const upload = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
        folder: "Job_Seekers_Resume",
      });
      resume = { public_id: upload.public_id, url: upload.secure_url };
    } catch {
      return next(new ErrorHandler("Failed to upload resume.", 500));
    }
  }

  if (!resume.url) {
    return next(new ErrorHandler("Please upload your resume.", 400));
  }

  // Create application
  const application = await Application.create({
    jobSeekerInfo: {
      id: req.user._id,
      name,
      email,
      phone,
      address,
      coverLetter,
      role: "Job Seeker",
      resume,
    },
    employerInfo: { id: job.postedBy, role: "Employer" },
    jobInfo: { jobId: id, jobTitle: job.title },
  });

  res.status(201).json({ success: true, message: "Application submitted.", application });
});

/**
 * @desc Employer fetches all job applications
 * @route GET /api/applications/employer
 * @access Employer
 */
export const employerGetAllApplications = catchAsyncErrors(async (req, res) => {
  const applications = await Application.find({
    "employerInfo.id": req.user._id,
    "deletedBy.employer": false,
  }).select("-__v");

  res.status(200).json({ success: true, applications });
});

/**
 * @desc Job seeker fetches all their applications
 * @route GET /api/applications/job-seeker
 * @access Job Seeker
 */
export const jobSeekerGetAllApplications = catchAsyncErrors(async (req, res) => {
  const applications = await Application.find({
    "jobSeekerInfo.id": req.user._id,
    "deletedBy.jobSeeker": false,
  }).select("-__v");

  res.status(200).json({ success: true, applications });
});

/**
 * @desc Delete an application
 * @route DELETE /api/applications/:id
 * @access Job Seeker / Employer
 */
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const application = await Application.findById(req.params.id);
  if (!application) return next(new ErrorHandler("Application not found.", 404));

  // Mark application as deleted by the respective role
  const roleKey = req.user.role === "Job Seeker" ? "jobSeeker" : "employer";
  application.deletedBy[roleKey] = true;
  await application.save();

  // If both employer & job seeker delete, remove the application
  if (application.deletedBy.employer && application.deletedBy.jobSeeker) {
    await application.deleteOne();
  }

  res.status(200).json({ success: true, message: "Application Deleted." });
});
