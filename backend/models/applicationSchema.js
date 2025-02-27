import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  jobSeekerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Assuming job seekers are also stored in the User collection
    },
    name: {
      type: String,
      required: [true, "Job Seeker name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: [validator.isEmail, "Please provide a valid email."],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: (value) => validator.isMobilePhone(value, "any"),
        message: "Invalid phone number",
      },
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    resume: {
      public_id: { type: String, default: "" },
      url: { type: String, default: "" },
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["Job Seeker"],
      required: true,
    },
  },
  employerInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming employers are also stored in the User collection
      required: true,
    },
    role: {
      type: String,
      enum: ["Employer"],
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job", // Assuming jobs are stored in a separate Job collection
      required: true,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
  },
  deletedBy: {
    jobSeeker: { type: Boolean, default: false },
    employer: { type: Boolean, default: false },
  },
  matchScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100, // Assuming the match score ranges from 0 to 100
  },
}, { timestamps: true });

export const Application = mongoose.model("Application", applicationSchema);
