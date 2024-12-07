import React, { useState } from "react";
import axios from "axios";
import "./Feedback.css";

const Feedback = () => {
  const [formData, setFormData] = useState({
    starRating: 0,
    textFeedback: "",
  });

  const [showThankYou, setShowThankYou] = useState(false);
  const [message, setMessage] = useState("");
  const [sentiment, setSentiment] = useState("");

  const handleStarClick = (rating) => {
    if (formData.starRating === rating) {
      setFormData({ starRating: 0, textFeedback: "" });
    } else {
      setFormData({ ...formData, starRating: rating });
    }
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, textFeedback: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.starRating === 0) {
      alert("Please provide a star rating.");
      return;
    }

    try {
      // Step 1: Get sentiment from `/sentiment` API
      const sentimentResponse = await axios.post("http://localhost:4001/sentiment", {
        feedback: formData.textFeedback,
      });

      const analyzedSentiment = sentimentResponse.data.text; // Extract sentiment
      setSentiment(analyzedSentiment);

      // Step 2: Send full feedback (with sentiment) to `/feedback` API
      const feedbackData = {
        rating: formData.starRating,
        feedback: formData.textFeedback,
        sentiment: analyzedSentiment, // Include the sentiment
      };

      console.log(feedbackData)

      const feedbackResponse = await axios.post("http://localhost:4001/api/feedback", 
        feedbackData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(feedbackResponse)

      setMessage("Feedback submitted successfully!");
      setShowThankYou(true);

      // Reset form and sentiment after submission
      setFormData({ starRating: 0, textFeedback: "" });
      setTimeout(() => {
        setShowThankYou(false);
      }, 3000);
    } catch (error) {
      console.error("Error during submission:", error);
      setMessage("Failed to submit feedback. Please try again.");
    }
  };

  const feedbackLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <>
      <div className="feedback-container">
        <h2>
          <span role="img" aria-label="train">
            🚆
          </span>{" "}
          Railway Complaint System
        </h2>
        <p>We value your feedback to provide better service!</p>

        {message && <p className="submission-message">{message}</p>}

        {showThankYou && (
          <div className="thank-you-message">
            Thank you for your feedback!
            <br />
            <strong>Sentiment Analysis:</strong> {sentiment}
          </div>
        )}

        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Rate Our Service <span style={{ color: "red" }}>*</span>
            </label>
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${
                    formData.starRating >= star ? "selected" : ""
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
            </div>
            {formData.starRating > 0 && (
              <p className="feedback-label">
                {feedbackLabels[formData.starRating - 1]}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="textFeedback">Additional Feedback (Optional)</label>
            <textarea
              id="textFeedback"
              name="textFeedback"
              placeholder="Write your feedback here..."
              value={formData.textFeedback}
              onChange={handleTextChange}
              rows="3"
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Feedback
          </button>
        </form>
      </div>
    </>
  );
};

export default Feedback;
