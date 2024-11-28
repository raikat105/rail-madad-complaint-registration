import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import img from "../Assets/Profile.jpg";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile">
          <img src={img} alt="Profile" className="profile-img" />
          <h3>Your Name</h3>
        </div>
        <nav className="menu">
          <ul>
            <li>
              <a href="/profile">Your Profile</a>
            </li>
            <li>
              <a href="/complaint-history">Complaint History</a>
            </li>
            <li>
              <a href="/current-complaint-status">Current Complaint Status</a>
            </li>
            <li>
              <Link to="/complaints">New Complaints</Link>
            </li>
            <li>
              <a href="/logout">Logout</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Dashboard;
