import React, { useState } from "react";
import "./Form.css";

const Form = () => {
  const [audioRecording, setAudioRecording] = useState(false);

  const handleAudioStart = () => {
    setAudioRecording(true);
  };

  const handleAudioStop = () => {
    setAudioRecording(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Form Submitted!");
  };

  const handleReset = () => {
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
                <input type="text" placeholder="Enter Mobile" required />
                <button type="button" className="btn">
                  {" "}
                  Get OTP
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Enter PNR
                <span className="star">*</span>
              </label>
              <input type="text" placeholder="Enter PNR" required />
            </div>

            <div className="form-group">
              <label>
                Type
                <span className="star">*</span>
              </label>
              <select>
                <option value="*">Select your Type</option>
                <option value="Type1">Type 1</option>
                <option value="Type2">Type 2</option>
                <option value="Type3">Type 3</option>
              </select>
            </div>

            <div className="form-group">
              <label>Subtype</label>
              <select>
                <option value="*">Select your Subtype</option>
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
              </div>
            </div>

            <div className="form-group">
              <label>Video</label>
              <input type="file" accept="video/*" />
            </div>

            <div className="form-group">
              <label>Image</label>
              <div className="image-controls">
                <input type="file" accept="image/*" className="upload-input" />
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
