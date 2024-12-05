import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  photo: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  gender: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
  },
  department: {
    type: String,
    enum: [
      "Passenger Service",
      "Maintenance and Engineering",
      "Safety and Security",
      "Catering and Hospitality",
      "Cleanliness",
      "Commercial",
      "Medical Services",
    ],
    required: function () {
      return this.role === "admin"; // Required only if the role is admin
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 8,
  }, // Store OTP expiration time
  token: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a unique index for the combination of email and department
userSchema.index({ email: 1, department: 1 }, { unique: true });

export const User = mongoose.model("User", userSchema);
