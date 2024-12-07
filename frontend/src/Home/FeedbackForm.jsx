import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeedbackForm = ({ userId }) => {
  const [complaintId, setComplaintId] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [message, setMessage] = useState('');
  const [sentiment, setSentiment] = useState('');

  // Fetch complaint details using userId when the component mounts
  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/users/complaint/${userId}`);
        const { complaintId, description } = response.data;
        setComplaintId(complaintId);
        setDescription(description);
      } catch (error) {
        setMessage('Failed to load complaint details. Please try again.');
      }
    };

    if (userId) {
      fetchComplaintDetails();
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = { userId, complaintId, description, rating, feedback };

    try {
      const response = await axios.post('http://localhost:5000/feedback', feedbackData);
      setMessage('Feedback submitted successfully!');
      setSentiment(response.data.sentiment);
      setRating(0);
      setFeedback('');
    } catch (error) {
      setMessage('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Feedback Form</h2>

      {message && <p className="text-center text-green-600 mb-4">{message}</p>}
      {sentiment && <p className="text-center text-blue-600 mb-4">Sentiment: {sentiment}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">Rate the Settlement</label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button 
                type="button" 
                key={star} 
                onClick={() => setRating(star)} 
                className={`w-10 h-10 text-2xl ${rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="feedback" className="block text-gray-700 font-bold mb-2">Your Feedback</label>
          <textarea 
            id="feedback" 
            value={feedback} 
            onChange={(e) => setFeedback(e.target.value)} 
            required 
            className="w-full p-2 border border-gray-300 rounded" 
          ></textarea>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
