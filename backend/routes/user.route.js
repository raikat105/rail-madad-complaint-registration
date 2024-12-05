import express from "express";
import {
  generateOtp,
  getAdmins,
  getMyProfile,
  login,
  logout,
  register,
  sendOtpEmail,
  validateOtp,
} from "../controller/user.controller.js";

import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/validate-otp", validateOtp);
router.post("/send-otp", generateOtp , sendOtpEmail); // New route for sending OTP
router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/my-profile", isAuthenticated, getMyProfile);
router.get("/admins", getAdmins);

export default router;
