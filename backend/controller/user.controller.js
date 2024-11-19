import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";

// Utility function to validate required fields
const validateFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) return `${field} is required`;
  }
  return null;
};

// Register a new user
export const register = async (req, res) => {
  try {
    // Validate photo upload
    if (!req.files || !req.files.photo || !req.files.photo.tempFilePath) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({ message: "Invalid photo format" });
    }

    // Validate required fields
    const requiredFields = ["email", "name", "password", "phone", "gender", "role"];
    const missingField = validateFields(requiredFields, req.body);
    if (missingField) {
      return res.status(400).json({ message: missingField });
    }

    const { email, name, password, phone, gender, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res.status(500).json({ message: "Failed to upload photo" });
    }

    // Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      gender,
      role,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();

    // Create token and set cookie
    const token = await createTokenAndSaveCookies(newUser._id, res);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    const requiredFields = ["email", "password", "role"];
    const missingField = validateFields(requiredFields, req.body);
    if (missingField) {
      return res.status(400).json({ message: missingField });
    }

    // Find user with email and password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Email is not registered yet" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate role
    if (user.role !== role) {
      return res.status(400).json({ message: `Role mismatch. Expected: ${user.role}` });
    }

    // Create token and set cookie
    const token = await createTokenAndSaveCookies(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Logout user
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get profile of the logged-in user
export const getMyProfile = async (req, res) => {
  try {
    const user = await req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Get all admins
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json({ admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};
