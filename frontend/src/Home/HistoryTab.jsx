// Import necessary libraries and components
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";
import "./HistoryTab.css";

const HistoryTab = () => {
  const [complaints, setComplaints] = useState([]); // State to store complaints
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  
  const { profile } = useAuth();
  console.log(profile?.user)

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const userId = profile?.user._id;
        if (!userId) return; // Exit if userId is not yet available
        const response = await axios.get(`http://localhost:4001/api/complaint/history?userId=${userId}`);
        setComplaints(response.data.complaints);
      } catch (err) {
        setError("Failed to fetch complaints. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchComplaints();
  }, [profile]); // Add profile as a dependency
  

  return (
    <div className="history-tab">
      <h1>Complaint History</h1>
      {loading && <p>Loading...</p>} {/* Show loading indicator */}
      {error && <p className="error">{error}</p>} {/* Show error message */}
      {!loading && !error && complaints.length === 0 && (
        <p>No complaints found.</p> /* Message for empty complaints */
      )}

      {!loading && !error && complaints.length > 0 && (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div key={complaint.complaintId} className="complaint-item">
              <h3>Complaint ID: {complaint.complaintId}</h3>
              <p><strong>PNR Number:</strong> {complaint.pnrNumber}</p>
              <p><strong>Phone Number:</strong> {complaint.phoneNumber}</p>
              <p><strong>Type:</strong> {complaint.complaintType}</p>
              <p><strong>Sub-Type:</strong> {complaint.complaintSubType}</p>
              <p><strong>Description:</strong> {complaint.description}</p>

              {complaint.image && (
                <p>
                  <strong>Image:</strong> <a href={complaint.image} target="_blank" rel="noopener noreferrer">View</a>
                </p>
              )}

              {complaint.audio && (
                <p>
                  <strong>Audio:</strong> <a href={complaint.audio} target="_blank" rel="noopener noreferrer">Listen</a>
                </p>
              )}

              {complaint.video && (
                <p>
                  <strong>Video:</strong> <a href={complaint.video} target="_blank" rel="noopener noreferrer">Watch</a>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
