import React from "react";
import {Link} from "react-router-dom";

import ticketbooking from "../Assets/ticketbooking.png";
import trainenq from "../Assets/trainenq.png";
import reservationenq from "../Assets/reservationen.png";
import freightbu from "../Assets/freightbu.png";
import indian from "../Assets/indian.png";
import utsenq from "../Assets/utsenq.png";
import retire from "../Assets/retire.png";
import chatbot from "../Assets/chatbot.png";

import "./Home.css";

const Home = () => {
  return (
    <>
       

      <Link to="https://www.irctc.co.in/nget/train-search" target="_blank">
      <div className="image-container overlay-image5">
        <img src={ticketbooking} alt="Ticket Booking" />
        <p className="image-text">Ticket Booking</p>
        </div>
      </Link>

      <Link to="https://enquiry.indianrail.gov.in/mntes/" target="_blank">
        <div className="image-container overlay-image3">
          <img src={trainenq} alt="Train Inquiry" />
          <p className="image-text">Train Inquiry</p>
        </div>
      </Link>

      <Link to="https://www.fois.indianrail.gov.in/RailSAHAY/index.jsp" target="_blank">
      <div className="image-container overlay-image1">
        <img src={freightbu} alt="Freight Business" />
        <p className="image-text">Freight Business</p>
      </div>
      </Link>

      <Link to="https://play.google.com/store/apps/details?id=com.cris.utsmobile&hl=en_IN" target="_blank">
      <div className="image-container overlay-image2">
        <img src={utsenq} alt="UTS Inquiry" />
        <p className="image-text">UTS Inquiry</p>
      </div>
      </Link>

      <Link to="https://indianrailways.gov.in/" target="_blank">
      <div className="image-container overlay-image6">
        <img src={indian} alt="Indian Railways" />
        <p className="image-text">Indian Railways</p>
      </div>
      </Link>

      <Link to="https://www.indianrail.gov.in/enquiry/StaticPages/StaticEnquiry.jsp?StaticPage=index.html" target="_blank">
      <div className="image-container overlay-image7">
        <img src={reservationenq} alt="Reservation Inquiry" />
        <p className="image-text">Reservation Inquiry</p>
      </div>
      </Link>

      <Link to="https://parcel.indianrail.gov.in/" target="_blank">
      <div className="image-container overlay-image8">
        <img src={utsenq} alt="UTS Inquiry" />
        <p className="image-text">Railway Parcel Website</p>
      </div>
      </Link>

      <Link to="https://rr.irctc.co.in/home#/home" target="_blank">
      <div className="image-container overlay-image4">
        <img src={retire} alt="Retiring Room" />
        <p className="image-text">Retiring Room</p>
      </div>
      </Link>
       
      <Link to="https://www.irctc.co.in/nget/train-search" target="_blank">
      <div className="image-container overlay-image9">
        <img src={chatbot} alt="Chatbot" />
        <p className="image-text">Chatbot</p>
      </div>
      </Link>

      
      
    </>
  

  
);
};

export default Home;

