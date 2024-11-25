import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  deleteComplaint,
  updateComplaint,
} from "../controller/complaint.controller.js"

import {
  validateComplaintExists,
  verifyComplaintOwnership,
  validateComplaintType,
  validateDepartment,
} from "../middleware/complaintMiddleware.js";

import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post("/", isAuthenticated, validateComplaintType, validateDepartment, createComplaint);
router.get("/", isAuthenticated, getMyComplaints);
router.get("/:id", isAuthenticated, validateComplaintExists, getComplaintById);
router.put(
  "/:id",
  isAuthenticated,
  validateComplaintExists,
  verifyComplaintOwnership,
  validateComplaintType,
  validateDepartment,
  updateComplaint
);
router.delete("/:id", isAuthenticated, validateComplaintExists, verifyComplaintOwnership, deleteComplaint);

export default router;