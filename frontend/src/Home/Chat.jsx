import React, { useState, useEffect } from "react";
import "./Chat.css";

function App() {
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [media, setMedia] = useState([]);
	const [chatHistory, setChatHistory] = useState(""); // To store the dialogue history

	useEffect(() => {
		if (isChatVisible) {
			const welcomeMessage =
				"Welcome to Rail Madad! How may I assist you today?";
			setMessages([{ type: "received", text: welcomeMessage }]);
			setChatHistory(`Chatbot: ${welcomeMessage}\n`); // Add to history
		}
	}, [isChatVisible]);

	const toggleChat = () => {
		setIsChatVisible(!isChatVisible);
		if (!isChatVisible) {
			setMessages([]);
			setMedia(null);
			setChatHistory(""); // Clear history when chat is closed
		}
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

	const sendMessage = async () => {
		if (!input.trim() && (!media || media.length === 0)) return; // Safeguard

		const payload = {
			text: input.trim(),
			media, // Array of media URLs
			chatHistory,
		};

		if (input.trim()) {
			const userMessage = { type: "sent", text: input };
			setMessages((prev) => [...prev, userMessage]);
		}

		if (media && media.length > 0) {
			// Check if media exists and has items
			const mediaMessage = { type: "sent", media };
			setMessages((prev) => [...prev, mediaMessage]);
			setMedia([]); // Clear media after sending
		}

		setInput("");

		try {
			const url = "http://localhost:4001/chat";
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			const botReply = data.text;

			if (input.trim()) {
				setChatHistory((prev) => prev + `User: ${input}\n`);
			}
			if (media && media.length > 0) {
				setChatHistory((prev) => prev + `User: [${media.length} Media Sent]\n`);
			}

			setMessages((prev) => [...prev, { type: "received", text: botReply }]);
			setChatHistory((prev) => prev + `Chatbot: ${botReply}\n`);
		} catch (error) {
			const errorMessage = "Error: Unable to connect to the server.";
			setMessages((prev) => [
				...prev,
				{ type: "received", text: errorMessage },
			]);
			if (input.trim()) {
				setChatHistory((prev) => prev + `User: ${input}\n`);
			}
			if (media && media.length > 0) {
				setChatHistory((prev) => prev + `User: [${media.length} Media Sent]\n`);
			}
			setChatHistory((prev) => prev + `Chatbot: ${errorMessage}\n`);
		}
	};

	const handleMediaUpload = async (event) => {
		const files = event.target.files;
		if (files) {
			const uploadedMedia = [];
			for (let i = 0; i < files.length; i++) {
				try {
					const url = await uploadToCloudinary(files[i]);
					if (typeof url === "string") {
						uploadedMedia.push(url);
					} else {
						console.error("Invalid Cloudinary response:", url);
					}
				} catch (error) {
					console.error("Failed to upload media:", error.message);
					alert("Failed to upload some media. Please try again.");
				}
			}
			setMedia((prevMedia) =>
				Array.isArray(prevMedia)
					? [...prevMedia, ...uploadedMedia]
					: [...uploadedMedia]
			); // Ensure prevMedia is iterable
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") sendMessage();
	};

	return (
		<div className="app">
			{!isChatVisible && (
				<div className="chat-icon" onClick={toggleChat}>
					<img src="../Assets/logo.jpg" alt="Chat Icon" />
				</div>
			)}

			{isChatVisible && (
				<div className="chat-window">
					<header className="chat-header">
						<h1>RailMadad</h1>
						<button className="minimize-btn" onClick={toggleChat}>
							–
						</button>
					</header>
					<div className="chat-messages">
						{messages.map((msg, index) => (
							<div key={index} className={`message ${msg.type}`}>
								{msg.text && typeof msg.text === "string" ? (
									<p>{msg.text}</p>
								) : null}
								{msg.media && Array.isArray(msg.media)
									? msg.media.map((url, i) => (
											<img
												key={i}
												src={url}
												alt={`Uploaded content ${i + 1}`}
												className="media-preview"
											/>
									  ))
									: null}
							</div>
						))}
					</div>

					<footer className="chat-footer">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Type your message..."
						/>
						<label className="media-upload-label" htmlFor="media-upload">
							📎
						</label>
						<input
							id="media-upload"
							type="file"
							accept="image/*,video/*"
							onChange={handleMediaUpload}
						/>
						<button onClick={sendMessage}>Send</button>
					</footer>
				</div>
			)}
		</div>
	);
}

export default App;
