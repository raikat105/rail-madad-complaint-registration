import React from "react";
import trainVideo from "../Assets/mark.mp4";
import ticketbooking from "../Assets/ticketbooking.png";
import trainenq from "../Assets/trainenq.png";
import reservationenq from "../Assets/reservationen.png";
import freightbu from "../Assets/freightbu.png";
import indian from "../Assets/indian.png";
import utsenq from "../Assets/utsenq.png";
import retire from "../Assets/retire.png";
import chatbot from "../Assets/chatbot.png";
import "./Body.css";

const Body = () => {
  return (
    <>
    <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src={trainVideo} type="video/mp4" />
      </video>
      </div>

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
          <p>Book your tickets easily here!</p>
        </div>
          </ul>
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
          <p>Check train schedules and statuses.</p>
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
          <p>Explore freight solutions.</p>
        </div></ul>
      </div>

      <div className="image-container overlay-image2">
      <ul className="nav-item">
        <img src={utsenq} alt="UTS Inquiry" />
        < p className="image-text">
        <a href="https://www.utsonmobile.indianrail.gov.in" target="_blank" rel="noopener noreferrer">
          UTS Enquiry
        </a>
        </p>
        <div className="dropdown-box1">
          <p>Access UTS services here.</p>
        </div></ul>
      </div>

      <div className="image-container overlay-image6">
        <ul className="nav-item">
        <img src={indian} alt="Indian Railways" />
        <p className="image-text"><a href="https://indianrailways.gov.in" target="_blank" rel="noopener noreferrer">
          Indian Railways
        </a></p>
        <div className="dropdown-box">
          <p>Discover Indian Railways services.</p>
        </div></ul>
      </div>

      <div className="image-container overlay-image7">
      <ul className="nav-item">
        <img src={reservationenq} alt="Reservation Inquiry" />
        <p className="image-text">
        <a href="https://www.indianrail.gov.in/enquiry/StaticPages/StaticEnquiry.jsp?StaticPage=index.html" target="_blank" rel="noopener noreferrer">
          Reservation Enquiry
        </a></p>
        <div className="dropdown-box">
          <p>Enquire about seat reservations.</p>
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
          <p>Enquire about sent parcels.</p>
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
          <p>Book retiring rooms at stations.</p>
        </div></ul>
      </div>

      {/* <div className="image-container overlay-image9">
        <img src={chatbot} alt="Chatbot" />
        <p className="white">Ask RailMate</p>
        <p className="white"></p>
      </div> */}

      </>
    
  );
};

export default Body;
