import React, { useState } from "react";
import axios from "axios";
import "./Form.css";

const Form = () => {
  const [audioRecording, setAudioRecording] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    setFiles({ ...files, [name]: e.target.files[0] });
  };

  const handleAudioStart = () => {
    setAudioRecording(true);
    // Logic to start audio recording can be added here.
  };

  const handleAudioStop = () => {
    setAudioRecording(false);
    // Logic to stop audio recording can be added here.
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const complaintData = {
        phoneNumber: formData.phoneNumber,
        pnrNumber: formData.pnrNumber,
        complaintType: formData.complaintType,
        complaintSubType: formData.complaintSubType,
        description: formData.description,
      };
  
      const uploadedFiles = {};
      if (files.image) {
        uploadedFiles.imageBase64 = await convertToBase64(files.image);
      }
      if (files.audio) {
        uploadedFiles.audioBase64 = await convertToBase64(files.audio);
      }
      if (files.video) {
        uploadedFiles.videoBase64 = await convertToBase64(files.video);
      }
  
      const completeComplaintData = { ...complaintData, ...uploadedFiles };
  
      const response = await axios.post(
        "http://localhost:4001/api/complaint/create",
        completeComplaintData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("Complaint submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };
  
  
  const handleReset = () => {
    setFormData({
      phoneNumber: "",
      pnrNumber: "",
      complaintType: "",
      complaintSubType: "",
      description: "",
    });
    setFiles({ image: null, video: null, audio: null });
    console.log("Form Reset");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h1>Grievance Detail</h1>
        <p className="mandatory">* Mandatory Fields</p>

        <div className="form-content">
          {/* Left Section */}
          <div className="form-left">
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
          </div>

          <div className="divider"></div>

          {/* Right Section */}
          <div className="form-right">
            <div className="form-group">
              <label>Audio</label>
              <div className="audio-controls">
                <button
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
                </button>
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
                required
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
    </div>
  );
};

export default Form;
