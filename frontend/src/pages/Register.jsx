import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function Register() {
  const { isAuthenticated, setIsAuthenticated, setProfile } = useAuth();

  const navigateTo = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [department, setDepartment] = useState("");

  const departments = [
    "Passenger Service",
    "Maintenance and Engineering",
    "Safety and Security",
    "Catering and Hospitality",
    "Cleanliness",
    "Commercial",
    "Medical Services",
  ];

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhotoPreview(reader.result);
      setPhoto(file);
    };

    reader.onerror = (err) => {
      console.error("Error reading file:", err);
      toast.error("Failed to load image. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role.");
      return;
    }

    if (role === "admin" && !department) {
      toast.error("Please select a department for the admin role.");
      return;
    }

    if (!gender) {
      toast.error("Please select a gender.");
      return;
    }

    if (!photo) {
      toast.error("Please upload a photo.");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photo.type)) {
      toast.error("Invalid photo format. Only JPEG, PNG, or WEBP are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("gender", gender);
    formData.append("photo", photo);
    if (role === "admin") {
      formData.append("department", department);
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4001/api/users/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(data.message || "User registered successfully");
      setProfile(data.user);
      setIsAuthenticated(true);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setRole("");
      setGender("");
      setPhoto("");
      setPhotoPreview("");
      setDepartment("");
      navigateTo("/");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <form onSubmit={handleRegister}>
          <div className="font-semibold text-xl items-center text-center">
            Rail<span className="text-blue-500">Mate</span>
          </div>
          <h1 className="text-xl font-semibold mb-6">Register</h1>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {role === "admin" && (
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 mb-4 border rounded-md"
            >
              <option value="">Select Department</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          )}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2  border rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Your Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2  border rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              placeholder="Your Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2  border rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2  border rounded-md"
            />
          </div>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md"
          >
            <option value="">Select Your Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Rather not say">Rather not say</option>
            <option value="Custom">Custom</option>
          </select>
          <div className="flex items-center mb-4">
            <div className="photo w-20 h-20 mr-4">
              <img
                src={photoPreview || "placeholder.jpg"}
                alt="Photo Preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="w-full p-2  border rounded-md"
              accept="image/*"
            />
          </div>
          <p className="text-center mb-4">
            Already registered?{" "}
            <Link to={"/login"} className="text-blue-600">
              Login Now
            </Link>
          </p>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 hover:bg-blue-800 duration-300 rounded-md text-white"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
