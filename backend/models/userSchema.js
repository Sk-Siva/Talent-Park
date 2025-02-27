import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    minlength: [3, "Name must contain at least 3 characters."],
    maxlength: [30, "Name cannot exceed 30 characters."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true, // Ensures no duplicate emails
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email."],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required."],
    validate: {
      validator: (value) => validator.isMobilePhone(value, "any"),
      message: "Invalid phone number format.",
    },
  },
  address: {
    type: String,
    required: [true, "Address is required."],
    trim: true,
  },
  niches: {
    firstNiche: { type: String, trim: true },
    secondNiche: { type: String, trim: true },
    thirdNiche: { type: String, trim: true },
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [8, "Password must contain at least 8 characters."],
    maxlength: [32, "Password cannot exceed 32 characters."],
    select: false, // Prevents password from being returned in queries
  },
  resume: {
    public_id: { type: String, default: "" },
    url: { type: String, default: "" },
  },
  coverLetter: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: Number(process.env.JWT_EXPIRE) || "7d", // Defaults to 7 days if not set
  });
};

export const User = mongoose.model("User", userSchema);
