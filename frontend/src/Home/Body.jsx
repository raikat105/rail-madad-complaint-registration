import React from "react";
import trainVideo from "../Assets/train4.mp4";
import "./Body.css";

const Body = () => {
  return (
    <div className="video-container">
      <video autoPlay loop muted className="background-video">
        <source src={trainVideo} type="video/mp4" />
        {/* Your browser does not support the video tag. */}
      </video>
      <div className="content">
        <span className="first">Rail</span>
        <span className="second">Mate</span>
      </div>
    </div>
  );
};

export default Body;
