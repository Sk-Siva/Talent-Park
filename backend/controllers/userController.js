import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { sendToken } from "../utils/jwtToken.js";

/**
 * User Registration
 */
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, address, password, role, firstNiche, secondNiche, thirdNiche, coverLetter } = req.body;

  if (!name || !email || !phone || !address || !password || !role) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  if (role === "Job Seeker" && (!firstNiche || !secondNiche || !thirdNiche)) {
    return next(new ErrorHandler("Please provide your preferred job niches.", 400));
  }

  if (await User.findOne({ email })) {
    return next(new ErrorHandler("Email is already registered.", 400));
  }

  const userData = { name, email, phone, address, password, role, niches: { firstNiche, secondNiche, thirdNiche }, coverLetter };

  if (req.files?.resume) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, { folder: "Job_Seekers_Resume" });
      userData.resume = { public_id: cloudinaryResponse.public_id, url: cloudinaryResponse.secure_url };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  }

  const user = await User.create(userData);
  sendToken(user, 201, res, "User Registered.");
});

/**
 * User Login
 */
export const login = catchAsyncErrors(async (req, res, next) => {
  const { role, email, password } = req.body;
  if (!role || !email || !password) {
    return next(new ErrorHandler("Email, password, and role are required.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)) || user.role !== role) {
    return next(new ErrorHandler("Invalid credentials.", 400));
  }

  sendToken(user, 200, res, "User logged in successfully.");
});

/**
 * User Logout
 */
export const logout = catchAsyncErrors(async (req, res) => {
  res.status(200).cookie("token", "", { expires: new Date(Date.now()), httpOnly: true }).json({
    success: true,
    message: "Logged out successfully.",
  });
});

/**
 * Get Current User Details
 */
export const getUser = catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

/**
 * Update Profile
 */
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = { name: req.body.name, email: req.body.email, phone: req.body.phone, address: req.body.address, coverLetter: req.body.coverLetter, niches: { firstNiche: req.body.firstNiche, secondNiche: req.body.secondNiche, thirdNiche: req.body.thirdNiche } };

  if (req.user.role === "Job Seeker" && (!newUserData.niches.firstNiche || !newUserData.niches.secondNiche || !newUserData.niches.thirdNiche)) {
    return next(new ErrorHandler("Please provide all preferred job niches.", 400));
  }

  if (req.files?.resume) {
    if (req.user.resume?.public_id) {
      await cloudinary.uploader.destroy(req.user.resume.public_id);
    }
    const uploadedResume = await cloudinary.uploader.upload(req.files.resume.tempFilePath, { folder: "Job_Seekers_Resume" });
    newUserData.resume = { public_id: uploadedResume.public_id, url: uploadedResume.secure_url };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, { new: true, runValidators: true, useFindAndModify: false });
  res.status(200).json({ success: true, user, message: "Profile updated." });
});

/**
 * Update Password
 */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(req.body.oldPassword))) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("New password & confirm password do not match.", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});