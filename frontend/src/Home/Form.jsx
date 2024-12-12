import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./Form.css";
import { useAuth } from "../context/AuthProvider";

const Form = () => {
  // const [audioRecording, setAudioRecording] = useState(false);
  const [complaintId, setComplaintId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    pnrNumber: "",
    complaintType: "",
    complaintSubType: "",
    description: "",
  });
  const [files, setFiles] = useState({
    image: null,
    video: null,
    audio: null,
  });
  const { profile } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFiles({ ...files, [name]: e.target.files[0] });
  };

  // const handleAudioStart = () => {
  //   setAudioRecording(true);
  //   // Logic to start audio recording can be added here.
  // };

  // const handleAudioStop = () => {
  //   setAudioRecording(false);
  //   // Logic to stop audio recording can be added here.
  // };

  const uploadToCloudinary = async (file, resourceType = "auto") => {
    const cloudName = "dehbw4s0x"; // Replace with your Cloudinary cloud name
    const uploadPreset = "comp_reg"; // Replace with your unsigned preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (response.ok) {
      return data.secure_url; // Returns the Cloudinary URL of the uploaded file
    } else {
      throw new Error(data.error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const complaintData = {
        // userId: profile?.user._id,
        // phoneNumber: formData.phoneNumber,
        // pnrNumber: formData.pnrNumber,
        // complaintType: formData.complaintType,
        // complaintSubType: formData.complaintSubType,
        description: formData.description,
      };
  
      const uploadedFiles = {};
      if (files.image) {
        uploadedFiles.imageUrl = await uploadToCloudinary(files.image, "image");
      }
      if (files.audio) {
        uploadedFiles.audioUrl = await uploadToCloudinary(files.audio, "raw");
      }
      if (files.video) {
        uploadedFiles.videoUrl = await uploadToCloudinary(files.video, "video");
      }

      const response = await axios.post(
        "https://2538-34-125-79-146.ngrok-free.app/submit",
        uploadedFiles,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        }
      );

      console.log(response.data.classifier)
  
      const completeComplaintData = { ...complaintData, ...uploadedFiles };

      const apiComplaintData = {
        ...completeComplaintData,
      }

      const res = await axios.post(
        "http://localhost:4001/api/complaint/create",
        apiComplaintData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const { complaintId } = res.data.complaint;
      setComplaintId(complaintId);
      setIsModalOpen(true);
  
      // Send email after successful complaint submission
      await fetch("http://localhost:4001/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile?.user.email, // User's email from profile
          complaintId,
          description: formData.description,
          // phoneNumber: formData.phoneNumber,
          // pnrNumber: formData.pnrNumber,
        }),
      });
  
      console.log("Complaint submitted and email sent successfully!");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      // phoneNumber: "",
      // pnrNumber: "",
      // complaintType: "",
      // complaintSubType: "",
      description: "",
    });
    setFiles({ image: null, video: null, audio: null });
    setComplaintId(null);
    console.log("Form Reset");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Grievance Detail</h1>
        {/* <p className="mandatory">* Mandatory Fields</p> */}

        <div className="form-content">
          {/* Left Section */}
          {/* <div className="form-left">
            <div className="form-group">
              <label>
                Enter Mobile
                <span className="star">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Enter Mobile"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="btn">
                  Get OTP
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Enter PNR
                <span className="star">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter PNR"
                name="pnrNumber"
                value={formData.pnrNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Type
                <span className="star">*</span>
              </label>
              <select
                name="complaintType"
                value={formData.complaintType}
                onChange={handleChange}
                required
              >
                <option value="">Select your Type</option>
                <option value="Type1">Type 1</option>
                <option value="Type2">Type 2</option>
                <option value="Type3">Type 3</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subtype</label>
              <select
                name="complaintSubType"
                value={formData.complaintSubType}
                onChange={handleChange}
              >
                <option value="">Select your Subtype</option>
                <option value="Subtype1">Subtype 1</option>
                <option value="Subtype2">Subtype 2</option>
                <option value="Subtype3">Subtype 3</option>
              </select>
            </div>
          </div> */}

          {/* <div className="divider"></div> */}

          {/* Right Section */}
          <div className="form-right">
            <div className="form-group">
              <label>Audio</label>
              <div className="audio-controls">
                {/* <button
                  type="button"
                  onClick={handleAudioStart}
                  disabled={audioRecording}
                  className="btn"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={handleAudioStop}
                  disabled={!audioRecording}
                  className="btn"
                >
                  Stop
                </button> */}
                <input
                  type="file"
                  accept="audio/*"
                  name="audio"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Video</label>
              <input
                type="file"
                accept="video/*"
                name="video"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label>Image</label>
              <div className="image-controls">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleFileChange}
                  className="upload-input"
                />
                <button type="button" className="btn">
                  Open Camera
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Problem Description</label>
              <textarea
                placeholder="Briefly describe your issue here..."
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="reset" onClick={handleReset} className="btn">
            Reset
          </button>
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        ariaHideApp={true} // Use true for accessibility
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            padding: "30px",
            width: "400px",
            borderRadius: "10px",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          },
        }}
      >
        <div>
          <h2 style={{color: "#000000", marginBottom: "10px", fontWeight: '700'}}>Complaint Submitted Successfully!</h2>
          <p style={{color: "#000000", marginBottom: "10px"}}>Your Complaint ID is:</p>
          <h1 style={{ color: "#4CAF50", marginBottom: "10px"}}>{complaintId}</h1>
          <p style={{color: "#000000", marginTop: "15px", fontWeight: '700'}}>Save this ID for future reference.</p>
          <button
            onClick={() => {
              setIsModalOpen(false);
              handleReset(); // Optionally reset the form on modal close
            }}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
			  marginTop: "15px",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Form;
