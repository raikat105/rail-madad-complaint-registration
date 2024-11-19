import React, { useState } from "react";
import "./Chat.css";

function App() {
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [chatMode, setChatMode] = useState(null); // PNR Status, Train Status, or AI Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    if (!isChatVisible) {
      setChatMode(null);
      setMessages([]);
    }
  };

  const handleOptionClick = (mode) => {
    setChatMode(mode);
    setMessages((prev) => [
      ...prev,
      { type: "received", text: `You selected ${mode}.` },
      {
        type: "received",
        text:
          mode === "PNR Status"
            ? "Please enter your PNR number:"
            : mode === "Live Train Running Status"
            ? "Please enter the train number:"
            : "Chat initiated. How can I help you?",
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "sent", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      let url = "";
      let requestBody = {};

      if (chatMode === "PNR Status") {
        url = "http://localhost:5000/pnr-status";
        requestBody = { pnr: input };
        console.log(requestBody)
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        console.log(data)
        const n = data.pnrDetails.data.numberOfpassenger;
        let answer = "PNR Number : " + data.pnrDetails.data.pnrNumber + "\nTrain Number : " + data.pnrDetails.data.trainNumber + "\nTrain Name : " + data.pnrDetails.data.trainName + "\nDate and Time Of Journey : " + data.pnrDetails.data.dateOfJourney + "\nBoarding Station : " + data.pnrDetails.data.boardingPoint + "\nDestination Station : " + data.pnrDetails.data.destinationStation + "\nJourney Class : " + data.pnrDetails.data.journeyClass + "\nNumber of passengers : " + data.pnrDetails.data.numberOfpassenger;
        for (let i = 0; i < n; i++) {
            answer = answer + "\n\nPassenger No. : " + data.pnrDetails.data.passengerList[i].passengerSerialNumber + "\n\nBooking Status : " + data.pnrDetails.data.passengerList[i].bookingStatusDetails;
        }

        setMessages((prev) => [...prev, { type: "received", text: answer}]);
      } 
      
      else if (chatMode === "Live Train Running Status") {
        url = "http://localhost:5000/train-status";
        requestBody = { trainNumber: input };
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        console.log(data);
        const statusMessage = data.trainDetails.body.train_status_message;
        const plainTextMessage = statusMessage.replace(/<[^>]*>/g, '');
        setMessages((prev) => [...prev, { type: "received", text: plainTextMessage}]);
      } 
      
      else if (chatMode === "AI Chatbot") {
        url = "http://localhost:5000/chat";
        requestBody = { message: input };
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        console.log(data)
        setMessages((prev) => [...prev, { type: "received", text: data.text}]);
      }
    } 
    
    catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "received", text: "Error: Unable to connect to the server."  + error},
      ]);
    }
  };

  return (
    <div className="app">
      {/* Chat Icon */}
      {!isChatVisible && (
        <div className="chat-icon" onClick={toggleChat}>
          <img src="../Assets/logo.jpg" alt="Chat Icon" />
        </div>
      )}

      {/* Chat Window */}
      {isChatVisible && (
        <div className="chat-window">
          <header className="chat-header">
            <h1>RailMadad</h1>
            <button className="minimize-btn" onClick={toggleChat}>
              –
            </button>
          </header>
          <div className="chat-messages">
            {chatMode === null && (
              <div className="options">
                <button onClick={() => handleOptionClick("PNR Status")}>
                  PNR Status
                </button>
                <button onClick={() => handleOptionClick("Live Train Running Status")}>
                  Live Train Running Status
                </button>
                <button onClick={() => handleOptionClick("AI Chatbot")}>
                  Live Chat with AI Chatbot
                </button>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                {msg.text}
              </div>
            ))}
          </div>
          {chatMode !== null && (
            <footer className="chat-footer">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
              />
              <button onClick={sendMessage}>Send</button>
            </footer>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
