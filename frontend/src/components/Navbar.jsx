import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {

  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  console.log(profile?.user);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "http://localhost:4001/api/users/logout",
        { withCredentials: true }
      );
      console.log(data);
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <p>
          <span className="first">Rail</span>
          <span className="second">Mate</span>
        </p>
      </Link>
      {profile?.user?.role !== "admin" && (
        <nav className="navbar">
          <div className="nav-box">
            <ul className="nav-links">
              <li className="nav-item">
                <Link to="/">Home</Link>
                <div className="dropdown-box">
                  <p>Welcome to Home!</p>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/complaints">Complaints</Link>
                <div className="dropdown-box">
                  <p>Submit your complaints here!</p>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/feed">Feedback</Link>
                <div className="dropdown-box">
                  <p>View the latest updates!</p>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/dashboard">Dashboard</Link>
                <div className="dropdown-box">
                  <p>Access your dashboard.</p>
                </div>
              </li>
              <li className="nav-item">
                <Link to="/contact">Contact</Link>
                <div className="dropdown-box">
                  <p>Contact us for support!</p>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      )}
      <div>
      </div>



      <div className="hidden md:flex space-x-2">
        {isAuthenticated && profile?.user?.role === "admin" ? (
          <Link
            to="/admin-dashboard"
            className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded"
          >
            DASHBOARD
          </Link>
        ) : null}

        {!isAuthenticated ? (
          <>
            <Link
              to="/Login"
              className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white font-semibold hover:bg-green-800 duration-300 px-4 py-2 rounded"
            >
              SIGN UP
            </Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded"
          >
            LOGOUT
          </button>
        )}
      </div>



    </header>
  );
};

export default Navbar;
