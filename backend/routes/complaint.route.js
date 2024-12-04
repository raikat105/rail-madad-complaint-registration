import express from "express";

import {
	createComplaint,
	getMyComplaints,
	getComplaintById,
	deleteComplaint,
	updateComplaint,
  getDeptComplaints,
} from "../controller/complaint.controller.js";

import {
	validateComplaintExists,
	verifyComplaintOwnership,
	validateDepartment,
} from "../middleware/complaintMiddleware.js";

import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

router.post(
	"/create",
	//isAuthenticated,
	createComplaint
);
router.get("/history", isAuthenticated, getMyComplaints);
router.get("/complaint-status", validateComplaintExists, getComplaintById);
router.put(
	"/:id",
	isAuthenticated,
	validateComplaintExists,
	verifyComplaintOwnership,
	validateDepartment,
	updateComplaint
);
router.delete(
	"/:id",
	isAuthenticated,
	validateComplaintExists,
	verifyComplaintOwnership,
	deleteComplaint
);
router.get("/deptComp", isAuthenticated, getDeptComplaints)

export default router;
