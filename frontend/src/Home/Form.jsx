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
				phoneNumber: formData.phoneNumber,
				pnrNumber: formData.pnrNumber,
				complaintType: formData.complaintType,
				complaintSubType: formData.complaintSubType,
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

			const completeComplaintData = { ...complaintData, ...uploadedFiles };
			
			try {
				const response = await fetch("http://127.0.0.1:5000/upload", {
				  method: "POST",
				  headers: {
					"Content-Type": "application/json",
				  },
				  body: JSON.stringify(completeComplaintData),
				});
			
				if (response.ok) {
				  const result = await response.json();
				  console.log("Server response:", result);
				} else {
				  console.error("Failed to send data to the server.");
				}
			  } catch (error) {
				console.error("Error sending data:", error);
			  }

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
								required>
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
								onChange={handleChange}>
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
									className="btn">
									Start
								</button>
								<button
									type="button"
									onClick={handleAudioStop}
									disabled={!audioRecording}
									className="btn">
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
								className="textarea"></textarea>
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
