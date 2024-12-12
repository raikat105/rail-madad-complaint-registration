import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Ensures a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
  name: {
    type: String,
    required: false,
    trim: true,
  },
  description: {
    type: String,
    required: false,
    trim: true,
  },
  media: {
    type: String, // Storing video, image, or other media in a single field (e.g., base64 or URL)
    required: false,
  },
  audio: {
    type: String, // Storing audio (e.g., base64 or URL)
    required: false,
  },
  complaintType: {
    type: String,
    required: false,
  },
  complaintSubType: {
    type: String,
    required: false,
  },
  pnrNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); 
      },
      message: props => `${props.value} is not a valid PNR number!`,
    },
  },
  department: {
    type: String,
    required: false,
    enum: ['Safety', 'Operations', 'Cleaning'], 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export const  Complaint = mongoose.model('Complaint', complaintSchema);
