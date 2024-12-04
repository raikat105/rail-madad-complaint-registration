import React, { useState } from 'react';
import axios from 'axios';
import './ComplaintStatusPage.css'; // Importing CSS file

const ComplaintStatusPage = () => {
  const [complaintId, setComplaintId] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleCheckStatus = async () => {
    setError('');
    setStatus('');

    if (!complaintId.trim()) {
      setError('Complaint ID cannot be empty.');
      return;
    }

    try {
      // Replace the URL below with your backend API endpoint
      const response = await axios.get(
        "http://localhost:4001/api/complaint/complaint-status",
        {
        params: { complaintId },
					headers: {
						"Content-Type": "application/json",
					},
      }
      );
      console.log(response.data.complaint)
    } catch (err) {
      setError('Failed to fetch complaint status. Please try again.');
    }
  };

  return (
    <div className="complaint-status-container">
      <h2>Complaint Status Checker</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter Complaint ID"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          className="input-field"
        />
      </div>
      <button onClick={handleCheckStatus} className="check-button">
        Check Status
      </button>
      <div className="status-container">
        {error && <p className="error-message">{error}</p>}
        {status && <p className="status-message">Status: {status}</p>}
      </div>
    </div>
  );
};

export default ComplaintStatusPage;
