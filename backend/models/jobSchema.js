import mongoose from "mongoose";
import validator from "validator";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minLength: [3, "Job title must be at least 3 characters long"],
    },
    jobType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    introduction: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: String,
      required: [true, "Responsibilities are required"],
      trim: true,
    },
    qualifications: {
      type: String,
      required: [true, "Qualifications are required"],
      trim: true,
    },
    offers: {
      type: String,
      trim: true,
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    hiringMultipleCandidates: {
      type: Boolean,
      default: false,
    },
    personalWebsite: {
      title: { type: String, trim: true },
      url: { type: String, validate: [validator.isURL, "Invalid website URL"] },
    },
    jobNiche: {
      type: String,
      required: true,
      trim: true,
    },
    newsLettersSent: {
      type: Boolean,
      default: false,
    },
    jobPostedOn: {
      type: Date,
      default: Date.now,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for optimization
jobSchema.index({ jobType: 1, location: 1, companyName: 1 });

// Auto-sort by latest jobs
jobSchema.pre("find", function () {
  this.sort({ jobPostedOn: -1 });
});

export const Job = mongoose.model("Job", jobSchema);
