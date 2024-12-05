import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookies from "../jwt/AuthToken.js";
import nodemailer from "nodemailer";

// Temporary in-memory store for OTPs
const otpStore = new Map();

// Utility function to validate required fields
const validateFields = (fields, body) => {
  for (const field of fields) {
    if (!body[field]) return `${field} is required`;
  }
  return null;
};

// Utility function to send OTP email
export const sendOtpEmail = async (email, otp) => {
  console.log(otp)
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL, // Your email
      pass: process.env.EMAIL_PASSWORD, // App password or email password
    },
  });

  const mailOptions = {
    from: `"RailMate Support" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your RailMate OTP",
    text: `Your OTP for registration is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Register a new user
export const register = async (req, res) => {
  try {
    // Step 1: Validate photo upload
    if (!req.files || !req.files.photo || !req.files.photo.tempFilePath) {
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({ message: "Invalid photo format" });
    }

    // Step 2: Validate required fields
    const requiredFields = ["email", "name", "password", "phone", "gender", "role", "otp"];
    const missingField = validateFields(requiredFields, req.body);
    if (missingField) {
      return res.status(400).json({ message: missingField });
    }

    const { email, name, password, phone, gender, role, department, otp } = req.body;

    // Step 3: Ensure department is provided for admin role
    if (role === "admin" && !department) {
      return res.status(400).json({ message: "Department is required for admin role" });
    }

    // Step 4: Check for email and department uniqueness for admin role
    if (role === "admin" && department) {
      const existingAdmin = await User.findOne({ department });
      if (existingAdmin) {
        return res.status(400).json({
          message: "An admin with this email is already registered for this department",
        });
      }
    }

    // Step 5: Check if the user already exists globally
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Step 6: Verify OTP
    const storedOtp = otpStore.get(email);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    otpStore.delete(email); // Clear OTP after successful validation

    // Step 7: Upload photo to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(cloudinaryResponse.error);
      return res.status(500).json({ message: "Failed to upload photo" });
    }

    // Step 8: Hash password and create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
      phone,
      gender,
      role,
      department: role === "admin" ? department : undefined, // Set department only for admin role
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      },
    });

    await newUser.save();

    // Step 9: Create token and set cookie
    const token = await createTokenAndSaveCookies(newUser._id, res);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
      },
      token: token,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry detected", error });
    }
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Generate and send OTP
export const generateOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    otpStore.set(email, { otp, expiresAt: expirationTime });

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Validate OTP (New Endpoint)
export const validateOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const entry = otpStore.get(email);

    if (!entry) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }

    const { otp: storedOtp, expiresAt } = entry;

    if (Date.now() > expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP after successful validation
    otpStore.delete(email);
    res.status(200).json({ message: "OTP validated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to validate OTP" });
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
