import React from "react";
import trainVideo from "../Assets/mark.mp4";

import "./Body.css";

const Body = () => {
  return (
    <>
      <div className="video-container">
        <video autoPlay loop muted className="background-video">
          <source src={trainVideo} type="video/mp4" />
        </video>
      </div>
    </>
  );
};

export default Body;
