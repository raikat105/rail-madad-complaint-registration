import React, { useState, useEffect } from "react";
import chatbot from "../Assets/chatbot.png";
import "./Chat.css";

function App() {
    const [isChatVisible, setIsChatVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatHistory, setChatHistory] = useState("");

    useEffect(() => {
        if (isChatVisible && messages.length === 0) {
            const welcomeMessage = "Welcome to Rail Madad! How may I assist you today?";
            setMessages([{ type: "received", text: welcomeMessage }]);
            setChatHistory((prev) => prev + `Chatbot: ${welcomeMessage}\n`);
        }
    }, [isChatVisible, messages]);

    const toggleChat = () => {
        setIsChatVisible(!isChatVisible);
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const payload = {
            text: input.trim(),
            chatHistory,
        };

        const userMessage = { type: "sent", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setChatHistory((prev) => prev + `User: ${input}\n`);
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

            setMessages((prev) => [...prev, { type: "received", text: botReply }]);
            setChatHistory((prev) => prev + `Chatbot: ${botReply}\n`);
        } catch (error) {
            const errorMessage = "Error: Unable to connect to the server.";
            setMessages((prev) => [...prev, { type: "received", text: errorMessage }]);
            setChatHistory((prev) => prev + `Chatbot: ${errorMessage}\n`);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") sendMessage();
    };

    return (
        <div className="app">
            {!isChatVisible && (
                <div className="chat-icon" onClick={toggleChat}>
                    <img src={chatbot} alt="Chat Icon" />
                    <p className="white">Ask RailMate</p>
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
                                {msg.text && typeof msg.text === "string" && <p>{msg.text}</p>}
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
                        <button onClick={sendMessage}>Send</button>
                    </footer>
                </div>
            )}
        </div>
    );
}

export default App;
