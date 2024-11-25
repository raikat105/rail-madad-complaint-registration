import { Complaint } from "../models/complaint.model.js";

// Middleware to check if a complaint exists
export const validateComplaintExists = async (req, res, next) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    req.complaint = complaint; // Attach the complaint to the request object for further use
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to validate complaint existence" });
  }
};

// Middleware to verify the ownership of a complaint
export const verifyComplaintOwnership = (req, res, next) => {
  try {
    const { complaint } = req;

    if (complaint.userId.toString() !== req.user._id) {
      return res.status(403).json({ message: "Unauthorized to perform this action" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to verify complaint ownership" });
  }
};

// Middleware to check complaint type validity
export const validateComplaintType = (req, res, next) => {
  const validTypes = ['General', 'Technical', 'Safety', 'Service'];
  const { complaintType } = req.body;

  if (complaintType && !validTypes.includes(complaintType)) {
    return res.status(400).json({ message: `Invalid complaint type. Must be one of: ${validTypes.join(", ")}` });
  }

  next();
};

// Middleware to validate department
export const validateDepartment = (req, res, next) => {
  const validDepartments = ['IT', 'HR', 'Operations', 'Customer Support'];
  const { department } = req.body;

  if (department && !validDepartments.includes(department)) {
    return res.status(400).json({ message: `Invalid department. Must be one of: ${validDepartments.join(", ")}` });
  }

  next();
};
