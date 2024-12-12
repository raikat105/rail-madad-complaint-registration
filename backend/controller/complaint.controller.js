import { Complaint } from "../models/complaint.model.js";
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
    const d = new Date();
    console.log(req.body);

    const { 
      description, 
      imageUrl, 
      videoUrl, 
      audioUrl 
    } = req.body;

    const complaintId = `CMP${d.getTime()}`;

    const complaint = new Complaint({ 
      complaintId, 
      description, 
      image: imageUrl, 
      video: videoUrl, 
      audio: audioUrl 
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ error: "Failed to create complaint" });
  }
};

// Get all complaints of the logged-in user
export const getMyComplaints = async (req, res) => {
  try {
    console.log(req.query);
    const { userId } = req.query;
    const complaints = await Complaint.find({ userId });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching user complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

// Get a single complaint by ID
export const getComplaintById = async (req, res) => {
  try {
    console.log(req.query);
    const { complaintId } = req.query;
    const complaint = await Complaint.findOne({ complaintId });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.status(200).json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint by ID:", error);
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
    console.error("Error updating complaint:", error);
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
    console.error("Error deleting complaint:", error);
    res.status(500).json({ error: "Failed to delete complaint" });
  }
};

// Get complaints by department
export const getDeptComplaints = async (req, res) => {
  try {
    const { dept } = req.params;
    const complaints = await Complaint.find({ department: dept });
    res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching department complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};