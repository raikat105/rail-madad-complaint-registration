import React, { useState, useEffect } from "react";
import "./Chat.css";

function App() {
	const [isChatVisible, setIsChatVisible] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState("");
	const [media, setMedia] = useState(null);
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

	const sendMessage = async () => {
		if (!input.trim() && !media) return;

		const payload = {
			text: input.trim(),
			media, // Base64 string
			chatHistory, // Include the full chat history
		};

		if (input.trim()) {
			const userMessage = { type: "sent", text: input };
			setMessages((prev) => [...prev, userMessage]);
		}

		if (media) {
			const mediaMessage = { type: "sent", media };
			setMessages((prev) => [...prev, mediaMessage]);
			setMedia(null);
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
				setChatHistory((prev) => prev + `User: ${input}\n`); // Append user message
			}
			if (media) {
				setChatHistory((prev) => prev + "User: [Media Sent]\n");
			}
			setMessages((prev) => [...prev, { type: "received", text: botReply }]);
			setChatHistory((prev) => prev + `Chatbot: ${botReply}\n`); // Append bot reply
		} catch (error) {
			const errorMessage = "Error: Unable to connect to the server.";
			setMessages((prev) => [
				...prev,
				{ type: "received", text: errorMessage },
			]);
			if (input.trim()) {
				setChatHistory((prev) => prev + `User: ${input}\n`); // Append user message
			}
			if (media) {
				setChatHistory((prev) => prev + "User: [Media Sent]\n");
			}
			setChatHistory((prev) => prev + `Chatbot: ${errorMessage}\n`); // Append error message
		}
	};

	const handleMediaUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setMedia(reader.result); // Set Base64 encoded image
			};
			reader.readAsDataURL(file);
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
								{msg.text && <p>{msg.text}</p>}
								{msg.media && (
									<img
										src={msg.media}
										alt="Uploaded content"
										className="media-preview"
									/>
								)}
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
