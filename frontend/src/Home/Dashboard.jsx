import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import img from "../Assets/Profile.jpg";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="profile">
          <img src={img} alt="Profile" className="profile-img" />
          <h3>Your Name</h3>
        </div>
        <nav className="menu">
          <ul>
            <li>
              <Link to="/profile">Your Profile</Link>
            </li>
            <li>
              <Link to="/complaint-history">Complaint History</Link>
            </li>
            <li>
              <Link to="/current-complaint-status">Current Complaint Status</Link>
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
    </>
  );
};

export default Dashboard;
