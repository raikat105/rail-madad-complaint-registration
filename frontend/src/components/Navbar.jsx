import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

import './Navbar.css';
import logo from '../Assets/icon.jpg';
import { LuPhoneCall } from "react-icons/lu";
import { PiPersonArmsSpreadThin } from "react-icons/pi";

export default function Navbar() {
    const [language, setLanguage] = useState('English');

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

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
        <nav className="nav text-black">
            <div className="site_image">
                <img src={logo} alt="RailMadad Logo" className="img" />
            </div>
            <div className="site_name">
                <h1 className="name">RailMadad</h1>
                <p className="para">For Inquiry, Assistance and Grievance Redressal</p>
            </div>
            <div className="number">
                <span className="phone"><LuPhoneCall />139</span>
                <p className="para_p">for Security/Medical Assistance</p>
            </div>
            <div className="entry">
                <div className="hidden md:flex space-x-2">
                    {isAuthenticated && profile?.user?.role === "admin" ? (
                        <Link
                            to="/dashboard"
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
                <div className="language_selector">
                    <select
                        className="language_dropdown"
                        value={language}
                        onChange={handleLanguageChange}
                    >
                        <option value="English">English</option>
                        <option value="Hindi">हिंदी</option>
                        <option value="Bengali">বাংলা</option>
                        <option value="Tamil">தமிழ்</option>
                        <option value="Telugu">తెలుగు</option>
                        <option value="Urdu">اردو</option>
                        <option value="Marathi">मराठी</option>
                        <option value="Sanskrit">संस्कृत</option>
                    </select>
                </div>
                <div className="icons">
                    <div className="icon1"><PiPersonArmsSpreadThin /></div>
                </div>
            </div>
        </nav>
    );
}
