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
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/complaints">Complaints</Link>
            </li>
            <li>
              <Link to="/">Feed</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link> {/* Corrected path */}
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="lang-switch">
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="language-selector"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी (Hindi)</option>
          <option value="bn">বাংলা (Bengali)</option>
          <option value="mr">मराठी (Marathi)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
          <option value="or">ଓଡ଼ିଆ (Odia)</option>
          <option value="ur">اردو (Urdu)</option>
          <option value="kn">ಕನ್ನಡ (Kannada)</option>
          <option value="sa">संस्कृतम् (Sanskrit)</option>
        </select>
      </div>
    </header>
  );
};

export default Navbar;
