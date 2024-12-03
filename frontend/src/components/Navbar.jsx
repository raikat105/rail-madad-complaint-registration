import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <p>
          <span className="first">Rail</span>
          <span className="second">Mate</span>
        </p>
      </Link>
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
              <Link to="/">Feed</Link>
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
      <div>
        <ul className="nav-item"><button type="button" className="btn3">
          {" "}
          Login
          </button>
          <div className="dropdown-box">
                <p>Already registered.</p>
          </div></ul>
      </div> 
      <div>
      <ul className="nav-item"><button type="button" className="btn2">
          {" "}
          Sign Up
          </button>
          <div className="dropdown-box">
                <p>Create new account.</p>
          </div></ul>
      </div>
    </header>
  );
};

export default Navbar;
