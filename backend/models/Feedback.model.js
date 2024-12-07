import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  feedback: { type: String, required: false },
  sentiment: { type: String, required: true }, // New Field
  date: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model('Feedback', feedbackSchema);

