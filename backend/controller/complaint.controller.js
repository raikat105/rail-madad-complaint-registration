import {Complaint} from "../models/complaint.model.js";
import { v2 as cloudinary } from "cloudinary";
// Utility function to validate required fields
const validateFields = (fields, body) => {
	for (const field of fields) {
		if (!body[field]) return `${field} is required`;
	}
	return null;
};

// Create a new complaint
export const createComplaint = async (req, res) => {
	try {
		const d = new Date()
		console.log(req.body)
		// Validate required fields
		const requiredFields = [
			"phoneNumber",
			"pnrNumber",
			"complaintSubType",
			"description",
			"complaintType",
		];
		const missingField = validateFields(requiredFields, req.body);
		if (missingField) {
			return res.status(400).json({ message: missingField });
		}

		const {
			pnrNumber,
			phoneNumber,
			description,
			complaintType,
			complaintSubType,
			imageURL,
			audioURL,
			videoURL,
		} = req.body;
		
		const complaintId = phoneNumber + d.getTime();

		// Create a new complaint
		const complaint = new Complaint({
			//userId: req.user._id, 
			complaintId,
			phoneNumber,
			pnrNumber,
			description,
			image: imageURL,
			video: videoURL,
			audio: audioURL,
			complaintType,
			complaintSubType,
		});

		await complaint.save();

		res.status(201).json({
			message: "Complaint created successfully",
			complaint,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create complaint" });
	}
};

// Get all complaints of the logged-in user
export const getMyComplaints = async (req, res) => {
	try {
		const complaints = await Complaint.find({ userId: req.user._id });
		res.status(200).json({ complaints });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch complaints" });
	}
};

// Get a single complaint by ID
export const getComplaintById = async (req, res) => {
	try {
		const { id } = req.params;
		const complaint = await Complaint.findById(id);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		res.status(200).json({ complaint });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch complaint" });
	}
};

// Update a complaint
export const updateComplaint = async (req, res) => {
	try {
		const { id } = req.params;

		const complaint = await Complaint.findByIdAndUpdate(
			id,
			{ ...req.body, updatedAt: Date.now() },
			{ new: true }
		);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		res.status(200).json({
			message: "Complaint updated successfully",
			complaint,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to update complaint" });
	}
};

// Delete a complaint
export const deleteComplaint = async (req, res) => {
	try {
		const { id } = req.params;

		const complaint = await Complaint.findByIdAndDelete(id);

		if (!complaint) {
			return res.status(404).json({ message: "Complaint not found" });
		}

		res.status(200).json({ message: "Complaint deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete complaint" });
	}
};

export const getDeptComplaints = async (req, res) => {
	try {
		const { dept } = req.params;
	  const complaints = await Complaint.find({ department: dept });
	  res.status(200).json({ complaints });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Failed to fetch complaints" });
	}
  };