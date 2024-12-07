const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  complaintId: { type: String, required: true },
  description: { type: String, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'], required: true }, // New Field
  date: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
