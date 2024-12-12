import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import img from "../Assets/Profile.jpg";
import Navbar from "../components/Navbar";

const AdminDashboard = () => {
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
              <Link to="/profile">Statistics at a glance:</Link>
            </li>
            <li>
              <Link to="/dept-complaints">Total Complaints</Link>
            </li>
            <li>
              <Link to="/complaints">Average Resolution Time</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
