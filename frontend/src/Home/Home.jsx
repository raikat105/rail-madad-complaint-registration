// import React from "react";
// import trainVideo from "../Assets/mark.mp4";
import ticketbooking from "../Assets/ticketbooking.png";
import trainenq from "../Assets/trainenq.png";
import reservationenq from "../Assets/reservationen.png";
import freightbu from "../Assets/freightbu.png";
import indian from "../Assets/indian.png";
import utsenq from "../Assets/utsenq.png";
import retire from "../Assets/retire.png";
// import chatbot from "../Assets/chatbot.png";
import "./Home.css";
import React, { useState, useEffect } from "react";
import chatbot from "../Assets/chatbot.png";
import "./Chat.css";



const Home = () => {
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
        <>
            {/* Icons with dropdowns */}
            <div className="image-container overlay-image5">
                <ul className="nav-item">
                    <img src={ticketbooking} alt="Ticket Booking" />
                    <div className="image-text">
                        <a href="https://www.irctc.co.in/nget/train-search" target="_blank" rel="noopener noreferrer">
                            Ticket Booking
                        </a>
                    </div>
                    <div className="dropdown-box1">
                        <p>Directs to the official ticket booking portal for reserving train seats online.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image4">
                <ul className="nav-item">
                    <img src={trainenq} alt="Train Inquiry" />
                    <p className="image-text">
                        <a href="https://enquiry.indianrail.gov.in" target="_blank" rel="noopener noreferrer">
                            Train Enquiry
                        </a>
                    </p>
                    <div className="dropdown-box1">
                        <p>Check train schedules and statuses!(Provides real-time updates)</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image1">
                <ul className="nav-item">
                    <img src={freightbu} alt="Freight Business" />
                    <p className="image-text">
                        <a href="https://www.fois.indianrail.gov.in/RailSAHAY/index.jsp" target="_blank" rel="noopener noreferrer">
                            Freight Business
                        </a>
                    </p>
                    <div className="dropdown-box1">
                        <p>Offers services for booking freight transportation for businesses.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image2">
                <ul className="nav-item">
                    <img src={utsenq} alt="UTS Ticketing" />
                    < p className="image-text">
                        <a href="https://www.utsonmobile.indianrail.gov.in" target="_blank" rel="noopener noreferrer">
                            UTS Ticketing
                        </a>
                    </p>
                    <div className="dropdown-box1">
                        <p>Enables unreserved ticketing and inquiries for local and suburban trains.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image6">
                <ul className="nav-item">
                    <img src={indian} alt="Indian Railways" />
                    <p className="image-text"><a href="https://indianrailways.gov.in" target="_blank" rel="noopener noreferrer">
                        Indian Railways
                    </a></p>
                    <div className="dropdown-box">
                        <p>Access the official website of Indian Railways for news, updates, and general information.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image7">
                <ul className="nav-item">
                    <img src={reservationenq} alt="Reservation Enquiry" />
                    <p className="image-text">
                        <a href="https://www.indianrail.gov.in/enquiry/StaticPages/StaticEnquiry.jsp?StaticPage=index.html" target="_blank" rel="noopener noreferrer">
                            Reservation Enquiry
                        </a></p>
                    <div className="dropdown-box">
                        <p>Check the status of your train ticket reservations, including PNR updates.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image8">
                <ul className="nav-item">
                    <img src={reservationenq} alt="Railway Parcel Website" />
                    <p className="image-text">
                        <a href="https://parcel.indianrail.gov.in/" target="_blank" rel="noopener noreferrer">
                            Railway Parcel Website
                        </a></p>
                    <div className="dropdown-box">
                        <p> Facilitates parcel booking and tracking for transporting goods by train.</p>
                    </div></ul>
            </div>

            <div className="image-container overlay-image3">
                <ul className="nav-item">
                    <img src={retire} alt="Retiring Room" />
                    <p className="image-text">
                        <a href="https://rr.irctc.co.in/home#/home" target="_blank" rel="noopener noreferrer">
                            Retiring Room
                        </a></p>
                    <div className="dropdown-box">
                        <p>Helps you book retiring rooms for a comfortable stay at railway stations.</p>
                    </div></ul>
            </div>

            {/* <div className="image-container overlay-image9">
                <ul className="nav-item">
                    <img src={chatbot} alt="Chatbot" />
                    <p className="white">ChatBot</p>
                    <div className="dropdown-box1">
                        <ul class="bulleted-text">
                            <li>Get AI assistance !</li>
                        </ul>
                    </div></ul>
            </div> */}

            <div className="app10">
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

        </>

    );
};

export default Home;